import React, { ChangeEvent, useState } from 'react';
import { EventOutput, Operation, PanelOptions, Event, Weekly, EventDate } from '../types';

import { createStyles, Dialog, DialogActions, DialogContent, DialogTitle, Theme } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';
import TextField from '@material-ui/core/TextField/TextField';
import moment from 'moment-timezone';
import { DAY_MAP } from '../utils';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import ColorSelector from './renderProps/ColorSelector';
import { convertTimeFromTimezone, convertTimezoneFromUtc, convertWeekFromTimezoneToUTC } from './hoc/withTimezone';

import { makeStyles } from '@material-ui/core/styles';
import DateRangeCollection from './DateRangeCollection';

const dayOptions = Object.values(DAY_MAP);
const TIME_FORMAT = 'HH:mm';
export const DATE_FORMAT = 'YYYY-MM-DDTHH:mm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      width: '100%',
    },
    input: {
      marginBottom: '20px',
    },
    textField: {
      marginRight: theme.spacing(2),
      width: 175,
    },
    colorPreview: {
      marginRight: '8px',
      padding: '4px',
      background: '#fff',
      borderRadius: '4px',
      display: 'inline-block',
      border: '1px solid',
      cursor: 'pointer',
      '& div': {
        width: '32px',
        height: '28px',
        borderRadius: '2px',
      },
    },
  })
);

interface EventModalProps {
  isOpenModal: boolean;
  isWeekly: boolean;
  operation: Operation;
  eventOutput: EventOutput | null;
  options: PanelOptions;
  timezone: string;
  onClose: () => void;
  onSubmit: (event: Weekly | Event, id: string) => void;
  onDelete: (id: string) => void;
}

const getInitialValues = (
  eventOutput: EventOutput | null,
  options: PanelOptions,
  isWeekly: boolean,
  timezone: string
) => {
  if (eventOutput) {
    if (isWeekly) {
      const event: Weekly = eventOutput.backupEvent as Weekly;
      return {
        name: event.name,
        days: eventOutput.days,
        start: moment(eventOutput.start).format(TIME_FORMAT),
        end: moment(eventOutput.end).format(TIME_FORMAT),
        value: event.value,
        color: event.color,
      };
    } else {
      const event: Event = eventOutput.backupEvent as Event;
      return {
        name: event.name,
        dates: [],
        inputDates: eventOutput?.dates?.map(date => ({
          start: convertTimezoneFromUtc(date.start, timezone).format(DATE_FORMAT),
          end: convertTimezoneFromUtc(date.end, timezone).format(DATE_FORMAT),
        })),
        value: event.value,
        color: event.color,
      };
    }
  } else {
    if (isWeekly) {
      return {
        name: options.defaultTitle,
        days: [],
        start: '00:00',
        end: '01:00',
        value: options.min,
        color: '',
      };
    } else {
      return {
        name: options.defaultTitle,
        dates: [],
        inputDates: [
          {
            start: moment().format(DATE_FORMAT),
            end: moment()
              .add(1, 'hour')
              .format(DATE_FORMAT),
          },
        ],
        value: options.min,
        color: '',
      };
    }
  }
};

const getValidationSchema = (options: PanelOptions, isWeekly: boolean) => {
  const validationSchema: any = {
    name: Yup.string().required('Title is required'),
  };
  if (options.min && options.max) {
    validationSchema['value'] = Yup.number()
      .min(options.min, `Should be higher than ${options.min}`)
      .max(options.max, `Should be lower than ${options.max}`);
  }
  if (isWeekly) {
    validationSchema['days'] = Yup.array().min(1, 'Select at least a day');
  } else {
    validationSchema['dates'] = Yup.array().min(1);
  }
  return validationSchema;
};

export default function EventModal(props: EventModalProps) {
  const { isOpenModal, isWeekly, operation, eventOutput, options, timezone, onClose, onSubmit, onDelete } = props;
  const [value, setValue] = useState(0);
  const classes = useStyles();
  const handleDeleteEvent = () => {
    if (eventOutput?.id) {
      onDelete(eventOutput?.id);
    }
  };

  const handleSubmit = (data: any) => {
    if (isWeekly) {
      data.days = convertWeekFromTimezoneToUTC(data.days, data.start, timezone);
      data.start = convertTimeFromTimezone(moment(data.start, TIME_FORMAT), timezone).format(TIME_FORMAT);
      data.end = convertTimeFromTimezone(moment(data.end, TIME_FORMAT), timezone).format(TIME_FORMAT);
    } else {
      data.dates = data.dates.map(({ start, end }: EventDate) => ({
        start: convertTimeFromTimezone(moment(start), timezone).format(DATE_FORMAT),
        end: convertTimeFromTimezone(moment(end), timezone).format(DATE_FORMAT),
      }));
    }
    onSubmit(data, eventOutput?.id || uuidv4());
  };

  const forceUpdate = () => {
    setValue(value + 1);
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={isOpenModal}
    >
      <Formik
        initialValues={getInitialValues(eventOutput, options, isWeekly, timezone)}
        validationSchema={Yup.object(getValidationSchema(options, isWeekly))}
        onSubmit={handleSubmit}
      >
        {formikProps => {
          const {
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            isValid,
            setErrors,
            setFieldError,
          } = formikProps;
          const defaultProps: any = {
            variant: 'outlined',
            size: 'small',
            onChange: (e: any) => handleChange(e),
          };

          const { name, days, start, end, inputDates, value, color } = values;
          let parsedDates = days as string[];

          function renderTitle() {
            return (
              <div className={classes.input}>
                <TextField
                  {...defaultProps}
                  name="name"
                  label="Title"
                  value={name}
                  fullWidth
                  helperText={(touched.name && errors.name) || ''}
                  error={touched.name && Boolean(errors.name)}
                />
              </div>
            );
          }

          function renderDays() {
            return (
              <div className={classes.input}>
                <Autocomplete
                  className={classes.input}
                  multiple
                  options={dayOptions}
                  getOptionLabel={(option: string) => option.toUpperCase()}
                  filterSelectedOptions
                  value={parsedDates}
                  renderInput={params => {
                    return (
                      <TextField
                        {...params}
                        variant="outlined"
                        name="days"
                        label="Days"
                        placeholder="Add more..."
                        helperText={(touched.days && errors.days) || ''}
                        error={touched.days && Boolean(errors.days)}
                        onBlur={handleBlur}
                      />
                    );
                  }}
                  size="small"
                  onChange={(e: ChangeEvent<{}>, value: string[]) => setFieldValue('days', value)}
                />
              </div>
            );
          }

          function renderStartEndTime() {
            return (
              <div className={classes.input}>
                <TextField
                  {...defaultProps}
                  label="Start time"
                  type="time"
                  name="start"
                  value={start}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: (options?.step || 1) * 60, // 1 min
                  }}
                />
                <TextField
                  {...defaultProps}
                  label="End time"
                  type="time"
                  name="end"
                  value={end}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: (options.step || 1) * 60, // 1 min
                  }}
                />
              </div>
            );
          }

          function renderEvents() {
            return (
              <div className={classes.input}>
                <DateRangeCollection
                  {...defaultProps}
                  inputDates={inputDates}
                  onChange={(eventDates, error) => {
                    setFieldValue('dates', eventDates);
                    if (error) {
                      setFieldError('dates', error);
                      forceUpdate();
                    } else if (errors.dates != null) {
                      delete errors.dates;
                      setErrors(errors);
                      forceUpdate();
                    }
                  }}
                  onBlur={() => {}}
                />
              </div>
            );
          }

          function renderValues() {
            return (
              <div className={classes.input}>
                {options.inputType === 'number' ? (
                  <TextField
                    {...defaultProps}
                    label="Value"
                    type="number"
                    id="number-input"
                    name="value"
                    value={value}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: options.step,
                      min: options.min,
                      max: options.max,
                    }}
                    helperText={(touched.value && errors.value) || ''}
                    error={touched.value && Boolean(errors.value)}
                  />
                ) : (
                  <>
                    <Typography gutterBottom>Value</Typography>
                    <Slider
                      {...defaultProps}
                      id="slider"
                      name="value"
                      min={options.min}
                      max={options.max}
                      value={value}
                      marks={[
                        { value: options.min, label: options.min },
                        { value: options.max, label: options.max },
                      ]}
                      valueLabelDisplay="auto"
                      aria-labelledby="continuous-slider"
                      onChange={(e, v) => setFieldValue('value', v)}
                    />
                  </>
                )}
              </div>
            );
          }

          function renderColor() {
            return (
              <ColorSelector
                defaultColor="#000"
                handleChange={color => {
                  setFieldValue('color', color);
                }}
                disabled={false}
                visible={false}
              >
                {({ color: colorFromSelector, handleClick, handleChange: handleChangeFromSelector, force }) => {
                  return (
                    <div className={classes.input}>
                      <div className={classes.colorPreview} onClick={handleClick}>
                        <div style={{ backgroundColor: force ? colorFromSelector : color }} />
                      </div>
                      <TextField
                        {...defaultProps}
                        label="Color"
                        type="text"
                        name="color"
                        value={color}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: (options.step || 1) * 60, // 1 min
                        }}
                        onChange={e => {
                          handleChangeFromSelector(e);
                          handleChange(e);
                        }}
                      />
                    </div>
                  );
                }}
              </ColorSelector>
            );
          }

          return (
            <Form>
              <DialogTitle id="customized-dialog-title" onAbort={onClose}>
                {operation === 'add' ? 'Add' : 'Edit'} {isWeekly ? 'Weekly ' : ''}Event
              </DialogTitle>
              <DialogContent dividers>
                <form>
                  {renderTitle()}
                  {isWeekly && renderDays()}
                  {isWeekly && renderStartEndTime()}
                  {!isWeekly && renderEvents()}
                  {options.hasPayload && renderValues()}
                  {renderColor()}
                </form>
              </DialogContent>
              <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                  Close
                </Button>
                {operation === 'edit' && (
                  <Button variant="outlined" color="secondary" onClick={handleDeleteEvent}>
                    Delete
                  </Button>
                )}
                <Button variant="outlined" color="primary" type="submit" disabled={!isValid}>
                  Save
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
}
