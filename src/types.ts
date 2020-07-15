import moment from 'moment-timezone';

type SeriesSize = 'sm' | 'md' | 'lg';

export interface SimpleOptions {
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
}

export interface EventDate {
  start: string;
  end: string;
}

export interface Weekly {
  id: string;
  name: string;
  value: number | string;
  color: string;
  days: Array<string>;
  start: string;
  end: string;
}

export interface Event {
  id: string;
  name: string;
  value: number | string;
  color: string;
  dates: Array<EventDate>;
}

export interface ExtractionOption {
  day: moment.Moment;
  dayString: string;
}

export interface EventOutput {
  id: string;
  start: Date;
  end: Date;
  title: string;
  value: number | string;
  color: string;
  isWeekly: boolean;
  event: Weekly | Event;
  days?: Array<moment.Moment>;
  dayString?: string;
}
