import { PanelPlugin } from '@grafana/data';
import moment from 'moment-timezone';
import { PanelOptions } from './types';
import { SimplePanel } from './SimplePanel';

export const plugin = new PanelPlugin<PanelOptions>(SimplePanel).setPanelOptions(builder => {
  return builder
    .addTextInput({
      path: 'defaultTitle',
      name: 'Default Title',
    })
    .addBooleanSwitch({
      path: 'hasPayload',
      name: 'Has Payload',
      defaultValue: true,
    })
    .addNumberInput({
      path: 'min',
      name: 'Min value',
      defaultValue: 0,
      showIf: config => config.hasPayload,
    })
    .addNumberInput({
      path: 'max',
      name: 'Max value',
      defaultValue: 100,
      showIf: config => config.hasPayload,
    })
    .addNumberInput({
      path: 'step',
      name: 'Step',
      defaultValue: 1,
      showIf: config => config.hasPayload,
    })
    .addRadio({
      path: 'inputType',
      defaultValue: 'number',
      name: 'Input Type',
      settings: {
        options: [
          {
            value: 'number',
            label: 'Number',
          },
          {
            value: 'slider',
            label: 'Slider',
          },
        ],
      },
    })
    .addBooleanSwitch({
      path: 'disableWeeklyEvent',
      name: 'Disable Weekly Event',
      defaultValue: false,
    })
    .addBooleanSwitch({
      path: 'disableEvent',
      name: 'Disable Event',
      defaultValue: false,
    })
    .addSelect({
      path: 'timezone',
      name: 'Timezone',
      settings: {
        options: moment.tz.names().map(it => ({ value: it, label: it })),
      },
      defaultValue: moment.tz.guess(),
    });
});
