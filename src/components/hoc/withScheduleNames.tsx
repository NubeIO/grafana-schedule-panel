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

  const updateScheduleName = (action: string, value: string): any => {
    switch (action) {
      case scheduleActions.CREATE_SCHEDULE_NAME:
        if (scheduleNameCollection.find((scheduleName: ScheduleName) => scheduleName.name === value)) {
          return _cloneDeep(scheduleNameCollection);
        }
        const scheduleName = scheduleNameService.create(value);
        const newScheduleNames = scheduleNameCollection.concat(scheduleName);
        setScheduleNameCollection(newScheduleNames);
        return _cloneDeep(newScheduleNames);
      case scheduleActions.DELETE_SCHEDULE_NAME:
        const filteredList = scheduleNameCollection.filter(item => item.id !== value);
        setScheduleNameCollection(filteredList);
        break;
    }
  };

  return (
    <ComposedComponent {...props} scheduleNames={scheduleNameCollection} updateScheduleName={updateScheduleName} />
  );
};

export default withScheduleNames;
