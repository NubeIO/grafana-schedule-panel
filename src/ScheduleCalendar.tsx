import React from 'react';
import TimezoneToggle from './TimezoneToggle';
import { stylesFactory, useTheme } from '@grafana/ui';
import { css } from 'emotion';
import { Avatar, Chip } from '@material-ui/core';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import withTimeZone from './wrapper/withTimezone';
import CustomEvent from './CustomEvent';

import 'react-big-calendar/lib/sass/styles.scss';

export default function ScheduleCalendar() {
  const theme = useTheme();
  const styles = getStyles();
  const color = theme.isDark ? 'primary' : 'default';

  const staticLocalizer = momentLocalizer(moment);
  const CalendarHOC = withTimeZone(Calendar);

  const eventExample = [
    {
      id: '61b2a89e-69d4-4a45-a6cf-3bf97c2e7550',
      start: '2020-07-14T02:00:00.000Z',
      end: '2020-07-14T08:00:00.000Z',
      title: 'Training',
      value: 11,
      color: '#9013fe',
      event: {
        name: 'Training',
        value: 11,
        color: '#9013fe',
        dates: [
          {
            start: '2020-07-14T02:00:00.000Z',
            end: '2020-07-14T08:00:00.000Z',
          },
        ],
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-06-28T17:00:00.000Z',
      end: '2020-06-28T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'sunday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-06-29T17:00:00.000Z',
      end: '2020-06-29T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'monday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-06-30T17:00:00.000Z',
      end: '2020-06-30T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'tuesday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-01T17:00:00.000Z',
      end: '2020-07-01T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'wednesday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-02T17:00:00.000Z',
      end: '2020-07-02T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'thursday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-05T17:00:00.000Z',
      end: '2020-07-05T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'sunday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-06T17:00:00.000Z',
      end: '2020-07-06T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'monday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-07T17:00:00.000Z',
      end: '2020-07-07T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'tuesday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-08T17:00:00.000Z',
      end: '2020-07-08T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'wednesday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-09T17:00:00.000Z',
      end: '2020-07-09T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'thursday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-12T17:00:00.000Z',
      end: '2020-07-12T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'sunday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-13T17:00:00.000Z',
      end: '2020-07-13T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'monday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-14T17:00:00.000Z',
      end: '2020-07-14T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'tuesday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-15T17:00:00.000Z',
      end: '2020-07-15T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'wednesday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-16T17:00:00.000Z',
      end: '2020-07-16T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'thursday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-19T17:00:00.000Z',
      end: '2020-07-19T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'sunday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-20T17:00:00.000Z',
      end: '2020-07-20T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'monday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-21T17:00:00.000Z',
      end: '2020-07-21T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'tuesday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-22T17:00:00.000Z',
      end: '2020-07-22T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'wednesday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-23T17:00:00.000Z',
      end: '2020-07-23T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'thursday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-26T17:00:00.000Z',
      end: '2020-07-26T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'sunday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-27T17:00:00.000Z',
      end: '2020-07-27T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'monday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-28T17:00:00.000Z',
      end: '2020-07-28T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'tuesday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-29T17:00:00.000Z',
      end: '2020-07-29T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'wednesday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
    {
      id: '288feecc-3886-430e-9e41-7b013dedd201',
      start: '2020-07-30T17:00:00.000Z',
      end: '2020-07-30T21:00:00.000Z',
      title: 'Training',
      value: null,
      color: '#d0021b',
      days: [
        '2020-07-12T17:00:00.000Z',
        '2020-07-13T17:00:00.000Z',
        '2020-07-14T17:00:00.000Z',
        '2020-07-15T17:00:00.000Z',
        '2020-07-16T17:00:00.000Z',
      ],
      isWeekly: true,
      dayString: 'thursday',
      event: {
        color: '#d0021b',
        start: '17:00',
        name: 'Training',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        end: '21:00',
        id: '288feecc-3886-430e-9e41-7b013dedd201',
        value: null,
      },
    },
  ];

  const onSelectEvent = (event: any) => {
    console.log('event', event);
    // const { isWeekly } = event;
    //
    // if (!isWeekly) {
    //   this.setState({
    //     editedRow: {
    //       id: event.id,
    //       dates: event.dates,
    //       name: event.title,
    //       value: event.value,
    //       color: event.color,
    //       isWeekly,
    //     },
    //   });
    // } else {
    //   this.setState({
    //     editedRow: {
    //       id: event.id,
    //       name: event.title,
    //       value: event.value,
    //       color: event.color,
    //       start: event.start,
    //       end: event.end,
    //       days: event.days,
    //       isWeekly,
    //     },
    //   });
    // }
    //
    // this.toggleEventForm(true, isWeekly);
  };

  const eventStyleGetter = ({ color }: { color: string }) => {
    const style = {
      backgroundColor: color,
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
    <TimezoneToggle timezone="UTC">
      {(toggleTimezone, timezone, timezoneName) => (
        <>
          <div className={styles.title}>
            <Chip
              className={styles.item}
              variant="outlined"
              size="small"
              label={`Timezone: ${timezoneName || 'UTC'}`}
              color={color}
              onClick={toggleTimezone}
              clickable
            />
            <div className={styles.blankSpace} />
            <Chip
              className={styles.item}
              variant="outlined"
              size="small"
              avatar={<Avatar>+</Avatar>}
              label="Weekly Event"
              color={color}
              clickable
            />
            <Chip
              className={styles.item}
              variant="outlined"
              size="small"
              avatar={<Avatar>+</Avatar>}
              label="Event"
              color={color}
              clickable
            />
          </div>
          <div className={styles.calendar}>
            <CalendarHOC
              events={eventExample}
              timezone={timezone}
              startAccessorField="start"
              endAccessorField="end"
              onSelectEvent={onSelectEvent}
              eventPropGetter={eventStyleGetter}
              localizer={staticLocalizer}
              components={{ event: CustomEvent }}
              defaultView="week"
            />
          </div>
        </>
      )}
    </TimezoneToggle>
  );
}

const getStyles = stylesFactory(() => {
  return {
    title: css`
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 4px;
    `,
    item: css`
      flex-grow: 0;
      &:last-child {
        margin-left: 4px;
      }
    `,
    blankSpace: css`
      flex-grow: 1;
    `,
    calendar: css`
      height: calc(100% - 30px);
    `,
  };
});
