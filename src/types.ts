import moment from 'moment-timezone';

type InputType = 'number' | 'slider';
export type Operation = 'add' | 'edit';

export interface PanelOptions {
  defaultTitle: string;
  hasPayload: boolean;
  min: number;
  max: number;
  step: number;
  inputType: InputType;
  allowOverlap: boolean;
  disableWeeklyEvent: boolean;
  disableEvent: boolean;
  timezone: string;
}

export interface EventDate {
  start: string; // 2020-07-20T02:00:00.000Z
  end: string; // 2020-07-20T08:00:00.000Z
  error?: string;
  isIncomplete?: boolean;
}

export interface Weekly {
  id: string;
  name: string;
  value: number | string;
  color: string;
  days: Array<string>;
  start: string; // 1:00
  end: string; // 2:00
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
  backupEvent: Weekly | Event;
  dates?: Array<EventDate>;
  days?: Array<moment.Moment>;
  dayString?: string;
}
