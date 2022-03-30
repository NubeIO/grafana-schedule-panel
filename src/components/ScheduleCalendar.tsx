import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { Spinner } from '@grafana/ui';
import flowRight from 'lodash/flowRight';
import _cloneDeep from 'lodash/cloneDeep';
import MomentUitls from '@date-io/moment';
import red from '@material-ui/core/colors/red';
import { Avatar, Chip } from '@material-ui/core';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import 'react-big-calendar/lib/sass/styles.scss';
import EventModal from './EventModal';
import CustomEvent from './CustomEvent';
import withTimeZone from './hoc/withTimezone';
import { DIALOG_NAMES } from '../constants/dialogNames';
import withGenericDialog from './hoc/withGenericDialog';
import withScheduleNames from './hoc/withScheduleNames';
import TimezoneToggle from './renderProps/TimezoneToggle';
import withCalendarHolidays from './hoc/withCalendarHolidays';
import { DAY_MAP, extractEvents, getDaysArrayByMonth } from '../utils';
import { EventOutput, Event, Weekly, PanelOptions, Operation, RawData } from '../types';

interface Props {
  value: any;
  setIsRunning: any;
  isRunning: boolean;
  options: PanelOptions;
  syncData: Function;
  openGenericDialog?: Function;
  scheduleNames: string[];
}

const CalendarHOC = flowRight(withTimeZone, withCalendarHolidays)(Calendar);

function AppContainer(props: any) {
  return (
    <ThemeProvider theme={createMuiTheme({})}>
      <MuiPickersUtilsProvider utils={MomentUitls}>{props.children}</MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

function ScheduleCalendar(props: Props) {
  const { value, options, isRunning, setIsRunning, syncData, openGenericDialog = (f: any) => f } = props;
  const classes = useStyles();

  const staticLocalizer = momentLocalizer(moment);

  const [eventCollection, setEventCollection] = useState<EventOutput[]>([]);
  const [visibleDate, setVisibleDate] = useState(moment());
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isWeekly, setIsWeekly] = useState(false);
  const [eventOutput, setEventOutput] = useState<EventOutput | null>(null);
  const [operation, setOperation] = useState<Operation>('add');
  useEffect(() => {
    updateEvents();
  }, [value, visibleDate]);

  const updateEvents = () => {
    const { events = {}, weekly = {} } = value || {};
    let eventsCollection: EventOutput[] = [];

    const isolatedEvents = extractEvents(events);

    const days = getDaysArrayByMonth(visibleDate);

    const dayEventsCollection = [];

    const dayEventMap: { [day: string]: { [id: string]: Weekly } } = {};
    for (const wKey in weekly) {
      if (weekly.hasOwnProperty(wKey) && weekly[wKey]) {
        const item: Weekly = weekly[wKey];
        item.days.forEach(d => {
          if (!dayEventMap[d]) {
            dayEventMap[d] = {};
          }
          dayEventMap[d][wKey] = item;
        });
      }
    }

    for (let i = 0; i < days.length; i += 1) {
      const day = days[i];
      const dayNumeric = day.day();
      const dayString = DAY_MAP[dayNumeric];
      const dayEventsMap = dayEventMap[dayString];
      if (dayEventsMap) {
        const dayEvents = extractEvents(dayEventsMap, {
          day,
          dayString,
        });
        dayEventsCollection.push(dayEvents);
      }
    }
    eventsCollection = eventsCollection.concat(isolatedEvents, ...dayEventsCollection);
    setEventCollection(eventsCollection);

    if (!options.hasPayload) {
      setEventCollection(
        eventsCollection.map((eventOutput: any) => {
          eventOutput.value = '';
          return eventOutput;
        })
      );
    }
    setIsRunning(false);
  };

  const addEvent = (isWeekly: boolean) => {
    setIsOpenModal(true);
    setOperation('add');
    setIsWeekly(isWeekly);
    setEventOutput(null);
  };

  const onModalClose = () => {
    setIsOpenModal(false);
  };

  const onSelectEvent = (eventOutput: EventOutput) => {
    if (eventOutput.isHoliday) {
      return openGenericDialog(DIALOG_NAMES.editHolidayDialog, { holiday: eventOutput });
    }
    setOperation('edit');
    setIsWeekly(eventOutput.isWeekly);
    setEventOutput(eventOutput);
    setIsOpenModal(true);
  };

  const syncOnMqttServer = (output: RawData) => {
    syncData(output);
    setIsOpenModal(false);
  };

  const handleModalSubmit = (event: Weekly | Event, id: string) => {
    let output: RawData = { events: {}, weekly: {}, holiday: {} };
    try {
      output = { events: { ...value.events }, weekly: { ...value.weekly }, holiday: { ...value.holiday } };
    } catch (e) {}
    if (isWeekly) {
      output.weekly[id] = event;
    } else {
      output.events[id] = event;
    }
    syncOnMqttServer(output);
  };

  const handleModalDelete = (id: string) => {
    const output: RawData = _cloneDeep(value) || {};
    if (isWeekly) {
      delete output.weekly[id];
    } else {
      delete output.events[id];
    }
    syncOnMqttServer(output);
  };

  const onNavigate = (visibleDate: any) => {
    setVisibleDate(moment(visibleDate));
  };

  const eventStyleGetter = (event: Event | Weekly) => {
    const style = {
      backgroundColor: event.color,
      borderRadius: '2px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return {
      style,
    };
  };

  return (
    <>
      <TimezoneToggle timezone={options.timezone}>
        {(toggleTimezone, timezone, timezoneName) => (
          <>
            <div className={classes.title}>
              <Chip
                className={classes.item}
                variant="outlined"
                size="small"
                label={`Timezone: ${timezoneName || 'UTC'}`}
                onClick={toggleTimezone}
                clickable
              />
              <div className={classes.blankSpace} />
              <Chip
                className={classes.item}
                variant="outlined"
                size="small"
                avatar={<Avatar>+</Avatar>}
                label="Holiday"
                clickable
                onClick={() => openGenericDialog(DIALOG_NAMES.holidayDialog, { isAddForm: true })}
              />
              <Chip
                className={classes.item}
                variant="outlined"
                size="small"
                avatar={<Avatar>+</Avatar>}
                label="Weekly Event"
                clickable
                onClick={() => addEvent(true)}
                disabled={options.disableWeeklyEvent}
              />
              <Chip
                className={classes.item}
                variant="outlined"
                size="small"
                avatar={<Avatar>+</Avatar>}
                label="Event"
                clickable
                onClick={() => addEvent(false)}
                disabled={options.disableEvent}
              />
            </div>
            <div className={classes.calendar}>
              <CalendarHOC
                value={value}
                defaultView="week"
                timezone={timezone}
                endAccessorField="end"
                onNavigate={onNavigate}
                events={eventCollection}
                startAccessorField="start"
                date={visibleDate.toDate()}
                localizer={staticLocalizer}
                onSelectEvent={onSelectEvent}
                components={{ event: CustomEvent }}
                eventPropGetter={eventStyleGetter}
              />
            </div>
            <EventModal
              isOpenModal={isOpenModal}
              scheduleNames={props.scheduleNames}
              isWeekly={isWeekly}
              operation={operation}
              eventOutput={eventOutput}
              options={options}
              timezone={timezone}
              onClose={onModalClose}
              onSubmit={handleModalSubmit}
              onDelete={handleModalDelete}
            />
          </>
        )}
      </TimezoneToggle>
      {isRunning && (
        <div className={classes.spinner}>
          <Spinner size={12} />
        </div>
      )}
    </>
  );
}

const useStyles = makeStyles({
  title: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '4px',
  },
  item: {
    flexGrow: 0,
    marginRight: '4px',
    '&:last-child': {
      marginLeft: '0px',
    },
  },
  holiday: {
    color: red[500],
    borderColor: red[500],
  },
  blankSpace: {
    flexGrow: 1,
  },
  calendar: {
    height: 'calc(100% - 30px)',
  },
  spinner: {
    top: '-32px',
    right: '-2px',
    position: 'absolute',
  },
});

const ScheduleCalendarHoc = flowRight(withScheduleNames, withGenericDialog)(ScheduleCalendar);

export default function(props: any) {
  return (
    <AppContainer>
      <ScheduleCalendarHoc {...props} />
    </AppContainer>
  );
}
