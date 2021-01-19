import React, { useState, useEffect } from 'react';
import _cloneDeep from 'lodash/cloneDeep';

import { PanelOptions } from 'types';
import { ScheduleName } from '../scheduleName/scheduleName.model';
import * as scheduleActions from '../scheduleName/scheduleName.action';
import * as scheduleNameService from '../scheduleName/scheduleName.service';

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

const withScheduleNames = (ComposedComponent: any) => (props: Props) => {
  const [scheduleNameCollection, setScheduleNameCollection] = useState<ScheduleName[]>([]);
  useEffect(() => {
    let { scheduleNames = [] } = props.value || {};
    if (!scheduleNames) {
      scheduleNames = [];
    }
    if (scheduleNames.length !== scheduleNameCollection.length) {
      setScheduleNameCollection(scheduleNames);
    }
  }, [props.value]);

  const syncScheduleNames = (scheduleNames: ScheduleName[]) => {
    const data = _cloneDeep(props.value) || {};
    data.scheduleNames = scheduleNames;
    props.syncData(data);
  };

  const updateScheduleName = (action: string, value: string): any => {
    switch (action) {
      case scheduleActions.CREATE_SCHEDULE_NAME:
        if (scheduleNameCollection.find((scheduleName: ScheduleName) => scheduleName.name === value)) {
          syncScheduleNames(scheduleNameCollection);
          return;
        }
        const scheduleName = scheduleNameService.create(value);
        const newScheduleNames = scheduleNameCollection.concat(scheduleName);
        syncScheduleNames(newScheduleNames);
        break;
      case scheduleActions.DELETE_SCHEDULE_NAME:
        const filteredList = scheduleNameCollection.filter(item => item.id !== value);
        const data = _cloneDeep(props.value);
        data.scheduleNames = filteredList;
        props.syncData(data);
        setScheduleNameCollection(filteredList);
        break;
    }
  };

  return (
    <ComposedComponent {...props} scheduleNames={scheduleNameCollection} updateScheduleName={updateScheduleName} />
  );
};

export default withScheduleNames;
