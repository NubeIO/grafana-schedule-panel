import moment from 'moment-timezone';
import teal from '@material-ui/core/colors/teal';
import { ExtractionOption, Weekly, Event, EventOutput, HolidayEvent, HolidayPayload } from './types';

import holidays from './constants/holidays.json';

/**
 * Gets the list of dates that would be visible in calendar view with dates from
 * previous and next month, that lies in the week of starting-1 and ending+1 day.
 * Here we are including starting-1 and ending+1 day to include all timezone dates on this range.
 * @param {number|string} [visibleDate] Date of the month whose output is required
 * @return {moment.Moment[]}
 */
export function getDaysArrayByMonth(visibleDate: moment.Moment) {
  const start = visibleDate
    .clone()
    .startOf('week')
    .add(-1, 'day');
  const end = moment(visibleDate)
    .endOf('month')
    .endOf('week')
    .add(1, 'day');
  return enumerateDaysBetweenDates(start, end, true, true);
}

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
 * @return {moment[]}
 */
export function enumerateDaysBetweenDates(
  startDate: moment.Moment,
  endDate: moment.Moment,
  inclusiveStart = false,
  inclusiveEnd = false
) {
  const dates: moment.Moment[] = [];

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

/**
 * Converts the given time into UTC by using the base date for date
 * @param baseDate - Used for setting the date (year, month, day)
 * @param time - Time in format HH:mm:ss or HH:mm
 * @return {moment} Time in UTC
 */
export function getUTCFromStartAndEnd(baseDate: moment.Moment, time: string): moment.Moment {
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
    'UTC'
  );
}

/**
 * @param {Weekly} event - Get Start and end date from data according to options
 * @param {ExtractionOption} options - Options used while extracting data from event
 * @return {{startDate: (moment.Moment), endDate: (moment.Moment)}}
 */
function getStartAndEndDate(
  event: Weekly,
  options: ExtractionOption
): { startDate: moment.Moment; endDate: moment.Moment } {
  const { day } = options;
  let time = day.clone();
  const startDate = getUTCFromStartAndEnd(time, event.start);

  let endDate = day.clone();
  time = event.start > event.end ? moment(endDate).add(1, 'days') : endDate;
  endDate = getUTCFromStartAndEnd(time, event.end);
  return { startDate, endDate };
}

export const convertWeekToUTC = (event: Weekly): moment.Moment[] => {
  const { start, days } = event;
  return enumerateDaysBetweenDates(moment().startOf('week'), moment().endOf('week'), true, true)
    .map(el => getUTCFromStartAndEnd(el.utc(), start))
    .filter(day => days.includes(DAY_MAP[day.day()]));
};

/**
 * Processes the data from API to input for calendar.
 * @param {Object.<string, Weekly|Event>} events - Dict of events where key represents the id
 * @param {ExtractionOption} options - Options used while extracting data from event
 * @return {EventOutput[]}
 */
export function extractEvents(events: { [id: string]: Weekly | Event }, options?: ExtractionOption): EventOutput[] {
  const eventsCollection: EventOutput[] = [];
  for (const eventId in events) {
    if (events[eventId]) {
      const event = events[eventId];
      if (!options) {
        let { dates } = event as Event;
        dates = dates || [];
        dates.forEach(date => {
          const { start, end } = date;
          eventsCollection.push({
            id: eventId,
            start: moment.utc(start).toDate(),
            end: moment.utc(end).toDate(),
            title: event.name,
            value: event.value,
            color: event.color,
            isWeekly: false,
            event: event,
            backupEvent: event,
          });
        });
      } else {
        const { dayString } = options;
        const { startDate, endDate } = getStartAndEndDate(event as Weekly, options);
        eventsCollection.push({
          id: eventId,
          start: startDate.toDate(),
          end: endDate.toDate(),
          title: event.name,
          value: event.value,
          color: event.color,
          days: convertWeekToUTC(event as Weekly),
          isWeekly: true,
          dayString,
          event: event,
          backupEvent: event,
        });
      }
    }
  }
  return eventsCollection;
}

/**
 *
 * @example
 * getYearRange(2021)
 * [2019, 2020, 2021, 2022, 2023]
 * @param currentYear
 */
function getYearRange(currentYear: number): number[] {
  const years = [];
  const maxYears = 5;
  let yearCount = -2;

  for (let i = 1; i <= maxYears; i++) {
    years.push(currentYear + yearCount);
    yearCount = yearCount + 1;
  }

  return years;
}

/**
 *
 * @param year
 * @param holiday
 */
function getHoliday(year: number, holiday: HolidayPayload): string {
  return `${year}-${holiday.month}-${holiday.day}`;
}

/**
 * @example
 * formatHolidays(2021, [{"title": "New Year", "day": 1, "month": 1}])
 * [{title: "New Year", day: 1, month: 1, date: '2021-1-1', end:'2021-1-1', start: '2021-1-1', id: 'id_1_2021_1_1 }]
 * @param year
 * @param holidays
 */
function formatHolidays(year: number, holidays: HolidayPayload[]): HolidayEvent[] {
  return holidays.map((holiday: HolidayPayload, index: number) => {
    const date = getHoliday(year, holiday);
    const start = new Date(date).setHours(0, 0, 0, 0);
    const end = new Date(date).setHours(23, 59, 59, 999);

    return {
      date,
      end: end,
      start: start,
      isHoliday: true,
      color: teal[500],
      title: holiday.title,
      id: `id_${index}_${year}_${holiday.month}_${holiday.day}`,
    };
  });
}

/**
 * Append list of holidays for a period of 5 years.
 * @returns {HolidayEvent[]}
 */
export function getHolidayEvents(): HolidayEvent[] {
  return getYearRange(new Date().getFullYear())
    .map((year: number) => formatHolidays(year, holidays))
    .flat();
}

/**
 * Check if today is a holiday
 * @returns {boolean}
 */
export function isTodayHoliday(): boolean {
  const today = new Date();

  const hasOffDays = holidays.map(holiday => {
    const date = new Date(getHoliday(today.getFullYear(), holiday));

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  });

  return hasOffDays.some(val => val);
}
