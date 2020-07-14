import React from 'react';
import TimezoneToggle from './TimezoneToggle';
import { stylesFactory, useTheme } from '@grafana/ui';
import { css } from 'emotion';
import { Avatar, Chip } from '@material-ui/core';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import withTimeZone from './wrapper/withTimezone';

import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function ScheduleCalendar() {
  const theme = useTheme();
  const styles = getStyles();
  const color = theme.isDark ? 'primary' : 'default';

  const staticLocalizer = momentLocalizer(moment);
  const CalendarHOC = withTimeZone(Calendar);

  const onEventSelected = (event: any) => {
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
              events={[]}
              timezone={timezone}
              startAccessorField="start"
              endAccessorField="end"
              onSelectEvent={onEventSelected}
              localizer={staticLocalizer}
              components={{ event: CustomEvent }}
              elementProps={[]}
              defaultView="week"
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
