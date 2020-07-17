import React, { useState } from 'react';
import { createStyles, TextField, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dateRange: {
      display: 'flex',
    },
    textField: {
      marginRight: theme.spacing(2),
      flex: 1,
    },
    buttonWrapper: {
      flex: 0,
      display: 'flex',
      alignItems: 'center',
      '&:not(:last-child)': {
        marginRight: theme.spacing(1),
      },
    },
    button: {
      backgroundColor: theme.palette.type === 'dark' ? '#3e3e3e' : '#eaeaea',
    },
  })
);

interface DateRangeProps {
  values: [string, string];
  onChange: ({ startDate, endDate }: { startDate: string; endDate: string }) => void;
}

export default function DateRange(props: DateRangeProps) {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(props.values[0]);
  const [endDate, setEndDate] = useState(props.values[1]);
  const [error, setError] = useState(false);

  const handleStartDateChange = (e: any) => {
    setStartDate(e.target.value);
    if (!moment(e.target.value).isBefore(endDate)) {
      setError(true);
    } else {
      setError(false);
      props.onChange({ startDate: e.target.value, endDate });
    }
  };

  const handleEndDateChange = (e: any) => {
    setEndDate(e.target.value);
    if (!moment(e.target.value).isAfter(startDate)) {
      setError(true);
    } else {
      setError(false);
      props.onChange({ startDate, endDate: e.target.value });
    }
  };

  return (
    <div className={classes.dateRange}>
      <TextField
        {...props}
        className={classes.textField}
        id="datetime-local"
        label="Start Date"
        type="datetime-local"
        value={startDate}
        onChange={handleStartDateChange}
        error={error}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        {...props}
        className={classes.textField}
        id="datetime-local"
        label="End Date"
        type="datetime-local"
        value={endDate}
        onChange={handleEndDateChange}
        error={error}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <div className={classes.buttonWrapper}>
        <IconButton aria-label="add" className={classes.button}>
          <AddIcon color="primary" fontSize="small" />
        </IconButton>
      </div>
      <div className={classes.buttonWrapper}>
        <IconButton aria-label="delete" className={classes.button}>
          <DeleteIcon color="secondary" fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
}
