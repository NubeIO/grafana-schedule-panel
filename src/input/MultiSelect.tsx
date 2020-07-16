import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import Select from '@material-ui/core/Select/Select';
import Input from '@material-ui/core/Input/Input';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      marginBottom: '20px',
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
  })
);

interface MultiSelectProps {
  name: string;
  options: string[];
}

export default function MultiSelect(props: MultiSelectProps) {
  const { name, options } = props;
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedOptions(event.target.value as string[]);
  };

  return (
    <FormControl fullWidth={true} className={classes.formControl} variant="outlined">
      <InputLabel>Days</InputLabel>
      <Select
        name={name}
        multiple
        value={selectedOptions}
        onChange={handleChange}
        input={<Input />}
        renderValue={selected => (
          <div className={classes.chips}>
            {(selected as string[]).map(value => (
              <Chip key={value} label={value} className={classes.chip} />
            ))}
          </div>
        )}
      >
        {options.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
