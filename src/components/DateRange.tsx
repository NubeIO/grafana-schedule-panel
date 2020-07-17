import React from 'react';
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

export default function DateRange(props: any) {
  const classes = useStyles();
  const today = moment().format('YYYY-MM-DDThh:mm');
  const tomorrow = moment()
    .add(1, 'day')
    .format('YYYY-MM-DDThh:mm');

  console.log('props', props);
  return (
    <div className={classes.dateRange}>
      <TextField
        {...props}
        className={classes.textField}
        id="datetime-local"
        label="Start Date"
        type="datetime-local"
        defaultValue={today}
      />
      <TextField
        {...props}
        className={classes.textField}
        id="datetime-local"
        label="End Date"
        type="datetime-local"
        defaultValue={tomorrow}
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
