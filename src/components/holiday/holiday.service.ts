import { RawData } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { Holiday, HolidayOutputEvent } from './holiday.model';

export function extractDay(date: any): string | number {
  return date.day();
}

export function extractMonth(date: any): string | number {
  return date.month();
}

export function create(name: string, color: string, date: any, value: number): Holiday {
  return {
    id: uuidv4(),
    name,
    color,
    date: date.toDate(),
    day: extractDay(date),
    month: extractMonth(date), // Month is zero indexed in JS
    value,
  };
}

export function updateData(holiday: Holiday, data: RawData) {
  const yearlyData = data?.yearly ? data.yearly : {};
  return {
    ...data,
    yearly: {
      ...yearlyData,
      [holiday.id]: {
        ...holiday,
      },
    },
  };
}
interface HolidayDTO {
  color: string;
  date: string;
  day: number;
  id: string;
  month: number;
  name: string;
  value: number;
}

export function transformYearlyEvent(event: HolidayDTO): HolidayOutputEvent {
  const start = new Date(event.date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(event.date);
  end.setHours(23, 59, 59, 999);
  return {
    ...event,
    end: end,
    start: start,
    isHoliday: true,
    title: event.name,
  };
}

export function getHolidayEvents(yearly: any = {}): HolidayOutputEvent[] {
  return Object.keys(yearly).map(key => transformYearlyEvent(yearly[key]));
}
