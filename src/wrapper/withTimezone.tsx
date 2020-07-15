import React, { Component } from 'react';
// @ts-ignore
import { accessor } from 'react-big-calendar/lib/utils/accessors';
import moment from 'moment-timezone';
import { DAY_MAP, enumerateDaysBetweenDates, getStartAndEndWithTimezone } from 'utils';

export const convertDateTimeToDate = (datetime: string, timezone: string) => {
  const m = moment.tz(datetime, timezone);
  return new Date(m.year(), m.month(), m.date(), m.hour(), m.minute(), 0);
};

export const convertDateToDateTime = (date: string, timezone: string) => {
  const dateM = moment.tz(date, timezone);
  return moment.tz(
    {
      year: dateM.year(),
      month: dateM.month(),
      date: dateM.date(),
      hour: dateM.hour(),
      minute: dateM.minute(),
    },
    timezone
  );
};

export const convertTimeFromTimezone = (dateM: moment.Moment, timezone: string) => {
  return moment
    .tz(
      {
        year: dateM.year(),
        month: dateM.month(),
        date: dateM.date(),
        hour: dateM.hour(),
        minute: dateM.minute(),
      },
      timezone
    )
    .utc();
};

export const convertWeekFromTimezoneToUTC = (days: Array<string>, start: string, timezone: string) => {
  return enumerateDaysBetweenDates(moment().startOf('week'), moment().endOf('week'), true, true)
    .map(el => getStartAndEndWithTimezone(el, start, timezone))
    .filter(day => days.includes(DAY_MAP[day.day()]))
    .map(el =>
      el
        .utc()
        .format('dddd')
        .toLowerCase()
    );
};

interface IProps {
  events: Array<any>;
  timezone: string;
  startAccessorField: string;
  endAccessorField: string;
  onSelectEvent: (event: any) => void;
  eventPropGetter: (event: any) => void;
  localizer: any;
  components: any;
  defaultView: string;
}

export default function withTimeZone(Calendar: any) {
  return class extends Component<IProps> {
    accessor = (event: object, field: string, timezone: string) => {
      const end = accessor(event, field);
      return convertDateTimeToDate(end, timezone);
    };

    static defaultProps = {
      events: [],
      startAccessor: 'start',
      endAccessor: 'end',
      timezone: 'UTC',
    };

    render() {
      const { timezone, startAccessorField, endAccessorField, onSelectEvent } = this.props;

      const bigCalendarProps = {
        ...this.props,
        startAccessor: (event: object) => this.accessor(event, startAccessorField, timezone),
        endAccessor: (event: object) => this.accessor(event, endAccessorField, timezone),
        onSelectEvent:
          onSelectEvent &&
          (({
            start,
            end,
            days,
            event,
            ...restProps
          }: {
            start: string;
            end: string;
            days: Array<moment.Moment>;
            event: any;
          }) => {
            const { dates } = event;
            onSelectEvent({
              ...restProps,
              ...event,
              days: days
                ? days.map(day =>
                    moment(day)
                      .tz(timezone)
                      .format('dddd')
                      .toLowerCase()
                  )
                : [],
              dates: dates
                ? dates.map(({ start: s, end: e }: { start: any; end: any }) => ({
                    start: convertDateTimeToDate(s, timezone),
                    end: convertDateTimeToDate(e, timezone),
                  }))
                : [],
              start: start ? convertDateTimeToDate(start, timezone) : undefined,
              end: end ? convertDateTimeToDate(end, timezone) : undefined,
            });
          }),
      };

      return <Calendar {...bigCalendarProps} showMultiDayTimes />;
    }
  };
}
