import React, { useState, useEffect } from 'react';
import _cloneDeep from 'lodash/cloneDeep';

import { PanelOptions } from 'types';
import _get from 'lodash/get';

interface Props {
  _client: any;
  value: any;
  topics: string[];
  setIsRunning: any;
  isRunning: boolean;
  options: PanelOptions;
  syncData: Function;
  openGenericDialog?: Function;
}

function getScheduleNames(scheduleNames: any, scheduleNameIds: any) {
  if (!(scheduleNameIds && scheduleNameIds.length > 0)) {
    return [];
  }
  return scheduleNameIds.map((id: string) => scheduleNames[id].name);
}

const withScheduleNames = (ComposedComponent: any) => (props: Props) => {
  const [scheduleNameCollection, setScheduleNameCollection] = useState<string[]>([]);
  useEffect(() => {
    let { scheduleNames = {} } = props.options || {};
    setScheduleNameCollection(getScheduleNames(scheduleNames.scheduleNames, scheduleNames.scheduleNameIds));
  }, [props.value]);

  return <ComposedComponent {...props} scheduleNames={scheduleNameCollection} />;
};

export default withScheduleNames;
