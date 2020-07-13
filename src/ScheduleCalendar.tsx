import React from 'react';
import TimezoneToggle from './TimezoneToggle';
import { stylesFactory, useTheme } from '@grafana/ui';
import { css } from 'emotion';
import { Avatar, Chip } from '@material-ui/core';

export default function ScheduleCalendar() {
  const theme = useTheme();
  const styles = getStyles();
  const color = theme.isDark ? 'primary' : 'default';

  return (
    <TimezoneToggle timezone="UTC">
      {(toggleTimezone, timezone, timezoneName) => (
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
      )}
    </TimezoneToggle>
  );
}

const getStyles = stylesFactory(() => {
  return {
    title: css`
      height: 14px;
      display: flex;
      flex-wrap: wrap;
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
  };
});
