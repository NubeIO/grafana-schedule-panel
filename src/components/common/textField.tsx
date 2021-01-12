import React from 'react';
import MuiTextField, { StandardTextFieldProps } from '@material-ui/core/TextField';

import fieldStyle from './fieldStyle';

interface Props {
  name: string;
  value: string;
  label: string;
  onChange: () => StandardTextFieldProps;
  error: any;
}

function TextField(props: Props) {
  const { name, label, value, onChange, error } = props;
  const classes = fieldStyle();

  return (
    <div className={classes.input}>
      <MuiTextField
        fullWidth
        name={name}
        size="small"
        label={label}
        value={value}
        error={error}
        variant="outlined"
        onChange={onChange}
      />
    </div>
  );
}

export default TextField;
