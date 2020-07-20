import React, { useEffect, useState } from 'react';
import TimezoneToggle from './renderProps/TimezoneToggle';
import { Spinner, stylesFactory } from '@grafana/ui';
import { css } from 'emotion';
import { Avatar, Chip } from '@material-ui/core';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import _ from 'lodash';
import withTimeZone from './hoc/withTimezone';
import CustomEvent from './CustomEvent';
import { DAY_MAP, extractEvents, getDaysArrayByMonth } from '../utils';
import { EventOutput, Event, Weekly, PanelOptions, Operation, RawData } from '../types';
import { DataFrame, Field } from '@grafana/data';

import 'react-big-calendar/lib/sass/styles.scss';
import EventModal from './EventModal';

interface IProps {
  _client: any;
  topics: string[];
  data: any;
  options: PanelOptions;
}

const CalendarHOC = withTimeZone(Calendar);

export default function ScheduleCalendar(props: IProps) {
  const { _client, topics, data, options } = props;
  const styles = getStyles();

  const staticLocalizer = momentLocalizer(moment);

  const [extractedValue, setExtractedValue] = useState<RawData>({ events: {}, weekly: {} });
  const [eventCollection, setEventCollection] = useState<Array<EventOutput>>([]);
  const [visibleDate, setVisibleDate] = useState(moment());
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isWeekly, setIsWeekly] = useState(false);
  const [eventOutput, setEventOutput] = useState<EventOutput | null>(null);
  const [operation, setOperation] = useState<Operation>('add');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const series: DataFrame[] = data?.series;
    const fields: Field[] = (series && series.length && series[0]?.fields) || [];
    const index = fields.map((field: Field) => field.name).indexOf('value');
    let value: any = {};
    if (index !== -1) {
      const values = fields[index].values;
      if (values && values.length) {
        value = values.get(values.length - 1);
      }
    }
    setExtractedValue(value);
  }, [data]);

  useEffect(() => {
    updateEvents();
  }, [extractedValue, visibleDate]);

  const updateEvents = () => {
    if (_.isEmpty(extractedValue)) {
      return;
    }
    const { events, weekly } = extractedValue;
    let eventsCollection: Array<EventOutput> = [];

    const isolatedEvents = extractEvents(events);

    const days = getDaysArrayByMonth(visibleDate);

    const dayEventsCollection = [];

    const dayEventMap: { [day: string]: { [id: string]: Weekly } } = {};
    for (const wKey in weekly) {
      if (weekly.hasOwnProperty(wKey) && weekly[wKey]) {
        const item: Weekly = weekly[wKey];
        item.days.forEach(d => {
          if (!dayEventMap[d]) {
            dayEventMap[d] = {};
          }
          dayEventMap[d][wKey] = item;
        });
      }
    }

    for (let i = 0; i < days.length; i += 1) {
      const day = days[i];
      const dayNumeric = day.day();
      const dayString = DAY_MAP[dayNumeric];
      const dayEventsMap = dayEventMap[dayString];
      if (dayEventsMap) {
        const dayEvents = extractEvents(dayEventsMap, {
          day,
          dayString,
        });
        dayEventsCollection.push(dayEvents);
      }
    }

    eventsCollection = eventsCollection.concat(isolatedEvents, ...dayEventsCollection);
    setEventCollection(eventsCollection);
    setIsRunning(false);
  };

  const addEvent = (isWeekly: boolean) => {
    setIsOpenModal(true);
    setOperation('add');
    setIsWeekly(isWeekly);
    setEventOutput(null);
  };

  const onModalClose = () => {
    setIsOpenModal(false);
  };

  const onSelectEvent = (eventOutput: EventOutput) => {
    setOperation('edit');
    setIsWeekly(eventOutput.isWeekly);
    setEventOutput(eventOutput);
    setIsOpenModal(true);
  };

  const syncOnMqttServer = (output: string) => {
    setIsRunning(true);
    if (!_client.current) {
      return;
    }
    if (!_client.current.connected) {
      _client.current.reconnect();
    }
    topics.forEach((topic: string) => {
      _client.current.publish(topic, output, { retain: true });
    });
    setIsOpenModal(false);
  };

  const handleModalSubmit = (event: Weekly | Event, id: string) => {
    const output: RawData = _.cloneDeep(extractedValue) || {};
    if (isWeekly) {
      if (!output.weekly) {
        output['weekly'] = {};
      }
      output.weekly[id] = event;
    } else {
      if (!output.events) {
        output['events'] = {};
      }
      output.events[id] = event;
    }
    syncOnMqttServer(JSON.stringify(output));
  };

  const handleModalDelete = (id: string) => {
    const output: RawData = _.cloneDeep(extractedValue) || {};
    if (isWeekly) {
      delete output.weekly[id];
    } else {
      delete output.events[id];
    }
    syncOnMqttServer(JSON.stringify(output));
  };

  const onNavigate = (visibleDate: any) => {
    setVisibleDate(moment(visibleDate));
  };

  const eventStyleGetter = (event: Event | Weekly) => {
    const style = {
      backgroundColor: event.color,
      borderRadius: '2px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return {
      style,
    };
  };

  return (
    <>
      <TimezoneToggle timezone={options.timezone}>
        {(toggleTimezone, timezone, timezoneName) => (
          <>
            <div className={styles.title}>
              <Chip
                className={styles.item}
                variant="outlined"
                size="small"
                label={`Timezone: ${timezoneName || 'UTC'}`}
                onClick={toggleTimezone}
                clickable
              />
              <div className={styles.blankSpace} />
              <Chip
                className={styles.item}
                variant="outlined"
                size="small"
                avatar={<Avatar>+</Avatar>}
                label="Weekly Event"
                clickable
                onClick={() => addEvent(true)}
              />
              <Chip
                className={styles.item}
                variant="outlined"
                size="small"
                avatar={<Avatar>+</Avatar>}
                label="Event"
                clickable
                onClick={() => addEvent(false)}
              />
            </div>
            <div className={styles.calendar}>
              <CalendarHOC
                events={eventCollection}
                timezone={timezone}
                startAccessorField="start"
                endAccessorField="end"
                onNavigate={onNavigate}
                onSelectEvent={onSelectEvent}
                eventPropGetter={eventStyleGetter}
                localizer={staticLocalizer}
                components={{ event: CustomEvent }}
                defaultView="week"
                date={visibleDate.toDate()}
              />
            </div>
            <EventModal
              isOpenModal={isOpenModal}
              isWeekly={isWeekly}
              operation={operation}
              eventOutput={eventOutput}
              options={options}
              timezone={timezone}
              onClose={onModalClose}
              onSubmit={handleModalSubmit}
              onDelete={handleModalDelete}
            />
          </>
        )}
      </TimezoneToggle>
      {isRunning && (
        <div className={styles.spinner}>
          <Spinner size={12} />
        </div>
      )}
    </>
  );
}

const getStyles = stylesFactory(() => {
  return {
    title: css`
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 4px;
    `,
    item: css`
      flex-grow: 0;
      &:last-child {
        margin-left: 4px;
      }
    `,
    blankSpace: css`
      flex-grow: 1;
    `,
    calendar: css`
      height: calc(100% - 30px);
    `,
    spinner: css`
      position: absolute;
      top: -32px;
      right: -2px;
    `,
  };
});
