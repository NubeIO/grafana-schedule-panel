import React from 'react';
import TimezoneToggle from './TimezoneToggle';
import { stylesFactory } from '@grafana/ui';
import { css } from 'emotion';
import { Chip } from '@material-ui/core';

export default function ScheduleCalendar() {
  const styles = getStyles();

  return (
    <TimezoneToggle timezone="UTC">
      {(toggleTimezone, timezone, timezoneName) => (
        <div className={styles.title}>
          <Chip
            variant="outlined"
            size="small"
            label={`Timezone: ${timezoneName || 'UTC'}`}
            color="primary"
            onClick={toggleTimezone}
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
    `,
  };
});
