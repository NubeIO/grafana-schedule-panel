import React from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import ScheduleCalendar from './ScheduleCalendar';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { blue, red } from '@material-ui/core/colors';

interface Props extends PanelProps<PanelOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  const palletType = theme.isDark ? 'dark' : 'light';
  const mainPrimaryColor = theme.isDark ? blue[500] : blue[900];
  const mainSecondaryColor = theme.isDark ? red[500] : red[900];

  const materialTheme = createMuiTheme({
    palette: {
      type: palletType,
      primary: {
        main: mainPrimaryColor,
      },
      secondary: {
        main: mainSecondaryColor,
      },
    },
  });

  const styles = getStyles();
  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <ThemeProvider theme={materialTheme}>
        <ScheduleCalendar data={data} options={options} />
      </ThemeProvider>
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
});
