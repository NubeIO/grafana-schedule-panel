import React from 'react';
import DateRange from './DateRange';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { EventOutput } from '../types';
import moment from 'moment-timezone';

const useStyles = makeStyles(() =>
  createStyles({
    dateRangeCollection: {
      '&:not(:last-child)': {
        marginBottom: '2px',
      },
    },
  })
);

interface DateRangeCollection {
  eventOutput: EventOutput;
}

const format = 'YYYY-MM-DDThh:mm';

export default function DateRangeCollection(props: DateRangeCollection) {
  const { eventOutput, ...restProps } = props;
  const classes = useStyles();
  return (
    <>
      {eventOutput?.dates?.map(({ start, end }) => {
        return (
          <div className={classes.dateRangeCollection}>
            <DateRange
              {...restProps}
              values={[moment(start).format(format), moment(end).format(format)]}
              onChange={({ startDate, endDate }) => {
                console.log('startDate', startDate);
                console.log('endDate', endDate);
              }}
            />
          </div>
        );
      })}
    </>
  );
}
