import { DateTime } from '@grafana/data';

export interface Holiday {
  id: string;
  name: string;
  date: string | Date | DateTime;
  color: string;
  day?: number | string;
  month?: number | string;
  value: number;
}

export interface HolidayOutputEvent {
  id: string;
  name: string;
  date: string | Date | DateTime;
  color: string;
  day?: number | string;
  month?: number | string;
  value: number | string;
  isYearly?: boolean;
  start: Date;
  isHoliday?: boolean;
  end: Date;
  title: string;
}
