import React, { useEffect, useRef, useState } from 'react';
import { DataFrame, Field, PanelProps } from '@grafana/data';
import { PanelOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import ScheduleCalendar from './components/ScheduleCalendar';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { blue, red } from '@material-ui/core/colors';
import { getDataSourceSrv } from '@grafana/runtime';

interface Props extends PanelProps<PanelOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  let _client: any = useRef(null);

  const [topics, setTopics] = useState<string[]>([]);
  const [writable, setWritable] = useState(false);
  const [value, setValue] = useState<any>({});
  const [dataSources, setDataSources] = useState([] as any);
  const [isRunning, setIsRunning] = useState(false);
  const theme = useTheme();
  const palletType = theme.isDark ? 'dark' : 'light';
  const mainPrimaryColor = theme.isDark ? blue[500] : blue[900];
  const mainSecondaryColor = theme.isDark ? red[500] : red[900];

  useEffect(() => {
    (async () => {
      try {
        const orgResponse = await fetch('/api/org');
        const org = await orgResponse.json();
        const userOrgsResponse = await fetch('/api/user/orgs');
        const userOrgs = await userOrgsResponse.json();
        const currentUserOrg = userOrgs.find((userOrg: any) => userOrg.orgId === org.id);
        setWritable(currentUserOrg.role !== 'Viewer');
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    const series: DataFrame[] = data?.series;
    const fields: Field[] = (series && series.length && series[0]?.fields) || [];
    const index = fields.map((field: Field) => field.name).indexOf('value');
    if (index !== -1) {
      const values = fields[index].values;
      if (values && values.length) {
        setValue(values.get(values.length - 1));
      }
    }
    setIsRunning(false);
  }, [data]);

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
    for (const dataSource of dataSources) {
      let match = false;
      getDataSourceSrv()
        .get(dataSource)
        .then(res => {
          if (res.meta.id === 'nubeio-mqtt-data-source') {
            // @ts-ignore
            const { client } = res;
            _client.current = client;
            match = true;
          }
        });
      if (match) {
        break;
      }
    }
  }, [dataSources]);

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
          value={value}
          isRunning={isRunning}
          options={options}
          setIsRunning={setIsRunning}
        />
      </ThemeProvider>
      {isRunning && <div className={styles.overlayRunning} />}
      {!writable && <div className={styles.overlay} />}
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
    overlayRunning: css`
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
    overlay: css`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transparent: 100%;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
});
