import React, { useEffect, useRef, useState } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import ScheduleCalendar from './components/ScheduleCalendar';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { blue, red } from '@material-ui/core/colors';
import * as mqtt from 'mqtt';
import { getDataSourceSrv } from '@grafana/runtime';

interface Props extends PanelProps<PanelOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  let _client: any = useRef(null);

  const [topics, setTopics] = useState<string[]>([]);
  const [dataSources, setDataSources] = useState([] as any);
  const [isRunning, setIsRunning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const theme = useTheme();
  const palletType = theme.isDark ? 'dark' : 'light';
  const mainPrimaryColor = theme.isDark ? blue[500] : blue[900];
  const mainSecondaryColor = theme.isDark ? red[500] : red[900];

  useEffect(() => {
    const targets: any[] = data?.request?.targets || [];
    const mqttValidConfig: any[] = targets.filter(target => !!target.topic);
    const topics: string[] = mqttValidConfig.map(target => target.topic);
    setTopics(topics);
    if (mqttValidConfig.length) {
      const dataSources$: any[] = mqttValidConfig.map(x => x.datasource);
      if (JSON.stringify(dataSources) !== JSON.stringify(dataSources$)) {
        setDataSources(dataSources$);
      }
    }
  }, [data]);

  useEffect(() => {
    if (_client.current) {
      _client.current.end();
    }
    for (const dataSource of dataSources) {
      let match = false;
      getDataSourceSrv()
        .get(dataSource)
        .then(res => {
          if (res.meta.id === 'nubeio-mqtt-data-source') {
            // @ts-ignore
            const { protocol = 'ws', host, port = 9001, authentication, username, password } = res;
            const options: any = { host, port, protocol };
            if (authentication) {
              options.username = username;
              options.password = password;
            }
            _client.current = mqtt.connect(options);
            _client.current.on('connect', () => {
              setIsConnected(true);
            });
            match = true;
          }
        });
      if (match) {
        break;
      }
    }
  }, [dataSources]);

  useEffect(() => {
    return () => {
      if (_client.current) {
        _client.current.end();
      }
    };
  }, []);

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
        <ScheduleCalendar
          _client={_client}
          topics={topics}
          data={data}
          isRunning={isRunning}
          options={options}
          setIsRunning={setIsRunning}
        />
      </ThemeProvider>
      {isRunning && <div className={styles.overlay} />}
      {(isConnected && <div className={styles.greenDot} />) || <div className={styles.redDot} />}
    </div>
  );
};

const dot = css`
  position: absolute;
  top: -32px;
  left: -2px;
  margin: 2px;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: inline-block;
`;

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
    overlay: css`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background: black;
      background: rgba(0, 0, 0, 0.3);

      filter: blur(4px);
      -o-filter: blur(4px);
      -ms-filter: blur(4px);
      -moz-filter: blur(4px);
      -webkit-filter: blur(4px);
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
    redDot: css`
      ${dot};
      background: radial-gradient(
          circle farthest-corner at 33% 33%,
          rgba(242, 0, 0, 0.85) 0%,
          rgba(150, 20, 20, 0.85) 80%
        ),
        radial-gradient(circle farthest-corner at 45% 45%, rgba(0, 0, 0, 0) 50%, #000000 80%);
    `,
    greenDot: css`
      ${dot};
      background: radial-gradient(
          circle farthest-corner at 33% 33%,
          rgba(77, 197, 21, 0.6) 0%,
          rgba(96, 183, 56, 1) 80%
        ),
        radial-gradient(circle farthest-corner at 45% 45%, rgba(50, 99, 28, 0) 50%, #418522 80%);
    `,
  };
});
