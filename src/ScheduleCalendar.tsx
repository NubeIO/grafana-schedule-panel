import React, { useEffect, useState } from 'react';
import TimezoneToggle from './TimezoneToggle';
import { stylesFactory, useTheme } from '@grafana/ui';
import { css } from 'emotion';
import { Avatar, Chip } from '@material-ui/core';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import withTimeZone from './wrapper/withTimezone';
import CustomEvent from './CustomEvent';
import { DAY_MAP, extractEvents, getDaysArrayByMonth } from './utils';
import { EventOutput, Event, Weekly } from './types';
import { DataFrame, Field } from '@grafana/data';
import _ from 'lodash';

import 'react-big-calendar/lib/sass/styles.scss';

interface IProps {
  data: any;
}

export default function ScheduleCalendar(props: IProps) {
  const { data } = props;
  const theme = useTheme();
  const styles = getStyles();
  const color = theme.isDark ? 'primary' : 'default';

  const staticLocalizer = momentLocalizer(moment);
  const CalendarHOC = withTimeZone(Calendar);

  const [extractedValue, setExtractedValue] = useState<{ events: any; weekly: any }>({ events: {}, weekly: {} });
  const [eventCollection, setEventCollection] = useState<Array<EventOutput>>([]);
  const [visibleDate, setVisibleDate] = useState(moment());

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
    console.log('eventsCollection', eventsCollection);
    setEventCollection(eventsCollection);
  };

  const onSelectEvent = (event: any) => {
    console.log('event', event);
    // const { isWeekly } = event;
    //
    // if (!isWeekly) {
    //   this.setState({
    //     editedRow: {
    //       id: event.id,
    //       dates: event.dates,
    //       name: event.title,
    //       value: event.value,
    //       color: event.color,
    //       isWeekly,
    //     },
    //   });
    // } else {
    //   this.setState({
    //     editedRow: {
    //       id: event.id,
    //       name: event.title,
    //       value: event.value,
    //       color: event.color,
    //       start: event.start,
    //       end: event.end,
    //       days: event.days,
    //       isWeekly,
    //     },
    //   });
    // }
    //
    // this.toggleEventForm(true, isWeekly);
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
    <TimezoneToggle timezone="UTC">
      {(toggleTimezone, timezone, timezoneName) => (
        <>
          <div className={styles.title}>
            <Chip
              className={styles.item}
              variant="outlined"
              size="small"
              label={`Timezone: ${timezoneName || 'UTC'}`}
              color={color}
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
              color={color}
              clickable
            />
            <Chip
              className={styles.item}
              variant="outlined"
              size="small"
              avatar={<Avatar>+</Avatar>}
              label="Event"
              color={color}
              clickable
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
        </>
      )}
    </TimezoneToggle>
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
  };
});
