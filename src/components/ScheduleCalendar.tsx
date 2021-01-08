import React, { useEffect, useState } from 'react';
import TimezoneToggle from './renderProps/TimezoneToggle';
import { Spinner } from '@grafana/ui';
import { Avatar, Chip } from '@material-ui/core';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import _ from 'lodash';
import withTimeZone from './hoc/withTimezone';
import withCalendarHolidays from './hoc/withCalendarHolidays';
import CustomEvent from './CustomEvent';
import { DAY_MAP, extractEvents, getDaysArrayByMonth, isTodayHoliday } from '../utils';
import { EventOutput, Event, Weekly, PanelOptions, Operation, RawData } from '../types';

import 'react-big-calendar/lib/sass/styles.scss';
import EventModal from './EventModal';
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import flowRight from 'lodash/flowRight';

interface Props {
  _client: any;
  topics: string[];
  value: any;
  options: PanelOptions;
  isRunning: boolean;
  setIsRunning: any;
}

const CalendarHOC = flowRight(withTimeZone, withCalendarHolidays)(Calendar);

export default function ScheduleCalendar(props: Props) {
  const { _client, topics, value, options, isRunning, setIsRunning } = props;
  const classes = useStyles();

  const staticLocalizer = momentLocalizer(moment);

  const [eventCollection, setEventCollection] = useState<EventOutput[]>([]);
  const [visibleDate, setVisibleDate] = useState(moment());
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isWeekly, setIsWeekly] = useState(false);
  const [eventOutput, setEventOutput] = useState<EventOutput | null>(null);
  const [operation, setOperation] = useState<Operation>('add');
  const isHoliday = isTodayHoliday();

  useEffect(() => {
    updateEvents();
  }, [value, visibleDate]);

  const updateEvents = () => {
    const { events = {}, weekly = {} } = value || {};
    let eventsCollection: EventOutput[] = [];

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

    if (!options.hasPayload) {
      setEventCollection(
        eventsCollection.map(eventOutput => {
          eventOutput.value = '';
          return eventOutput;
        })
      );
    }
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
    if (_client.current.disconnected) {
      _client.current.reconnect();
    }
    topics.forEach((topic: string) => {
      _client.current.publish(topic, output, { retain: true });
    });
    setIsOpenModal(false);
  };

  const handleModalSubmit = (event: Weekly | Event, id: string) => {
    const output: RawData = _.cloneDeep(value) || {};
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
    const output: RawData = _.cloneDeep(value) || {};
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
    <ThemeProvider theme={createMuiTheme({})}>
      <TimezoneToggle timezone={options.timezone}>
        {(toggleTimezone, timezone, timezoneName) => (
          <>
            <div className={classes.title}>
              <Chip
                className={classes.item}
                variant="outlined"
                size="small"
                label={`Timezone: ${timezoneName || 'UTC'}`}
                onClick={toggleTimezone}
                clickable
              />
              <div className={classes.blankSpace} />
              {isHoliday && <Chip className={`${classes.item} ${classes.holiday}`} size="small" variant="outlined" label="Holiday" />}
              <Chip
                className={classes.item}
                variant="outlined"
                size="small"
                avatar={<Avatar>+</Avatar>}
                label="Weekly Event"
                clickable
                onClick={() => addEvent(true)}
                disabled={options.disableWeeklyEvent}
              />
              <Chip
                className={classes.item}
                variant="outlined"
                size="small"
                avatar={<Avatar>+</Avatar>}
                label="Event"
                clickable
                onClick={() => addEvent(false)}
                disabled={options.disableEvent}
              />
            </div>
            <div className={classes.calendar}>
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
        <div className={classes.spinner}>
          <Spinner size={12} />
        </div>
      )}
    </ThemeProvider>
  );
}

const useStyles = makeStyles({
  title: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '4px',
  },
  item: {
    flexGrow: 0,
    marginRight: '4px',
    '&:last-child': {
      marginLeft: '0px',
    },
  },
  holiday: {
    color: red[500],
    borderColor: red[500],
  },
  blankSpace: {
    flexGrow: 1,
  },
  calendar: {
    height: 'calc(100% - 30px)',
  },
  spinner: {
    position: 'absolute',
    top: '-32px',
    right: '-2px',
  },
});
