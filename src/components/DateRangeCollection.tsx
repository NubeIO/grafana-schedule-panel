import React, { useEffect, useState } from 'react';
import DateRange from './DateRange';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { EventDate, EventOutput } from '../types';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';

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
  onChange: (eventDates: Array<EventDate>, error: string) => void;
}

const format = 'YYYY-MM-DDThh:mm';

export default function DateRangeCollection(props: DateRangeCollection) {
  const { eventOutput, onChange, ...restProps } = props;
  const [dates, setDates] = useState<{ [key: string]: EventDate }>({});
  const classes = useStyles();

  useEffect(() => {
    let convertedDict: { [key: string]: EventDate } = {};
    eventOutput?.dates?.forEach(date => {
      convertedDict[uuidv4()] = { start: moment(date.start).format(format), end: moment(date.end).format(format) };
    });
    setDates(convertedDict);
  }, [eventOutput?.dates]);

  useEffect(() => {}, [dates]);

  return (
    <>
      {Object.keys(dates).map(key => {
        const eventDate: EventDate = dates[key];
        return (
          <div key={key} className={classes.dateRangeCollection}>
            <DateRange
              {...restProps}
              values={[eventDate.start, eventDate.end]}
              onChange={eventDate => {
                let editedDates = dates;
                editedDates[key] = eventDate;
                setDates(editedDates);

                // Sending back the results
                const reformattedEditedDates: Array<EventDate> = [];
                const errors: Array<string> = [];
                Object.keys(editedDates).forEach(key => {
                  reformattedEditedDates.push(dates[key]);
                  const error = dates[key].error;
                  if (error) {
                    errors.push(error);
                  }
                });
                onChange(reformattedEditedDates, errors.length ? errors[0] : '');
              }}
            />
          </div>
        );
      })}
    </>
  );
}
