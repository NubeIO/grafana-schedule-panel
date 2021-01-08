import React from 'react';
import { EventOutput } from 'types';
import { getHolidayEvents } from 'utils';

interface Props {
  events: EventOutput[];
  timezone: string;
  startAccessorField: string;
  endAccessorField: string;
  onNavigate: (visibleDate: any) => void;
  onSelectEvent: (event: EventOutput) => void;
  eventPropGetter: (event: any) => void;
  localizer: any;
  components: any;
  defaultView: string;
  date?: string | Date;
}

const withCalendarHolidays = (ComposedComponent: any) => (props: Props) => {
  const holidays = getHolidayEvents();

  return <ComposedComponent {...props} events={[...props.events, ...holidays]} />;
};

export default withCalendarHolidays;
