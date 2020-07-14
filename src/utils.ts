import moment from 'moment-timezone';

/**
 * Dict of days of the week mapped to their full texts
 * @type {Object.<number, string>}
 */
export const DAY_MAP: { [index: number]: string } = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

/**
 * Gets a list of dates that lie between the startDate and endDate
 * @param {number|string} [startDate] - Input date, output doesn't include this day by default
 * @param {number|string} [endDate] - Input date, output doesn't include this day by default
 * @param {boolean} [inclusiveStart = false] - If true adds startDate to output
 * @param {boolean} [inclusiveEnd = false] - If true adds endDate to output
 * @return {Array<moment>}
 */
export function enumerateDaysBetweenDates(
  startDate: moment.Moment,
  endDate: moment.Moment,
  inclusiveStart: boolean = false,
  inclusiveEnd: boolean = false
) {
  const dates = [];

  const currDate = startDate.clone().startOf('day');
  const lastDate = endDate.clone().startOf('day');
  if (inclusiveStart) {
    dates.push(currDate.clone());
  }
  while (currDate.add(1, 'days').diff(lastDate) < 0) {
    dates.push(currDate.clone());
  }
  if (inclusiveEnd && currDate !== lastDate) {
    dates.push(currDate.clone());
  }

  return dates;
}

export function getStartAndEndWithTimezone(baseDate: moment.Moment, time: string, timezone: string) {
  const startTime = time.split(':');
  return moment.tz(
    {
      year: baseDate.year(),
      month: baseDate.month(),
      date: baseDate.date(),
      hour: startTime[0],
      minute: startTime[1],
      second: startTime[2] || 0,
    },
    timezone
  );
}
