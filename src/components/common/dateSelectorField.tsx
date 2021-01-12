import React from 'react';
import { DatePicker } from '@material-ui/pickers';

import fieldStyle from './fieldStyle';

interface Props {
  label: string;
  name: string;
  value: any;
  onChange: any;
}
function DateSelectorField(props: Props) {
  const { label, name, value, onChange } = props;
  const classes = fieldStyle();
  return (
    <div className={classes.input}>
      <DatePicker
        size="small"
        name={name}
        inputVariant="outlined"
        fullWidth
        label={label}
        variant="inline"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default DateSelectorField;
