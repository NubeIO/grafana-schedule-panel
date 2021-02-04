import React from 'react';
import { Select } from '@grafana/ui';
import _get from 'lodash/get';

function getOptions(props: any) {
  const scheduleNames = _get(props, 'context.options.scheduleNames.scheduleNames', {});
  const scheduleNameIds = _get(props, 'context.options.scheduleNames.scheduleNameIds', []);
  return scheduleNameIds.map((id: string) => scheduleNames[id]);
}

function DefaultScheduleName(props: any) {
  const { value, onChange } = props;
  return (
    <Select
      {...props}
      options={getOptions(props)}
      getOptionLabel={option => option.name}
      getOptionValue={option => option.id}
      value={value}
      onChange={v => {
        onChange(v);
      }}
    />
  );
}

export default DefaultScheduleName;
