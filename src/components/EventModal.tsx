import React, { ChangeEvent, useState } from 'react';
import { EventOutput, Operation, PanelOptions, Event, Weekly } from '../types';

import { createStyles, Dialog, DialogActions, DialogContent, DialogTitle, Theme } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';
import TextField from '@material-ui/core/TextField/TextField';

import { makeStyles } from '@material-ui/core/styles';
import { DAY_MAP } from '../utils';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import ColorSelector from './renderProps/ColorSelector';
import DateRangeCollection from './DateRangeCollection';

const dayOptions = Object.values(DAY_MAP);

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
  onModalClose: () => void;
  options: PanelOptions;
}

const getInitialValues = (
  eventOutput: EventOutput | null,
  operation: Operation,
  options: PanelOptions,
  isWeekly: boolean
) => {
  if (operation === 'add') {
    return {
      title: options.defaultTitle,
      days: [],
      startTime: '12:00',
      endTime: '12:00',
      dates: [],
      value: options.min,
      color: '',
    };
  } else {
    if (isWeekly) {
      const event: Weekly = eventOutput?.backupEvent as Weekly;
      return {
        title: event.name,
        days: event.days,
        startTime: event.start,
        endTime: event.end,
        value: event.value,
        color: event.color,
      };
    } else {
      const event: Event = eventOutput?.backupEvent as Event;
      return {
        title: event.name,
        dates: event.dates,
        value: event.value,
        color: event.color,
      };
    }
  }
};

const getValidationSchema = (options: PanelOptions, isWeekly: boolean) => {
  const validationSchema: any = {
    title: Yup.string().required('Title is required'),
    value: Yup.number()
      .min(options.min, `Should be higher than ${options.min}`)
      .max(options.max, `Should be lower than ${options.max}`),
  };
  if (isWeekly) {
    validationSchema['days'] = Yup.array().min(1, 'Select at least a day');
  } else {
    validationSchema['dates'] = Yup.array().min(1);
  }
  return validationSchema;
};

export default function EventModal(props: EventModalProps) {
  const { isOpenModal, isWeekly, operation, eventOutput, onModalClose, options } = props;
  const [value, setValue] = useState(0);
  const classes = useStyles();
  const handleDeleteEvent = () => {};
  const handleSubmit = (data: any) => {
    console.log(data);
  };

  const forceUpdate = () => {
    setValue(value + 1);
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      onClose={onModalClose}
      aria-labelledby="customized-dialog-title"
      open={isOpenModal}
    >
      <Formik
        initialValues={getInitialValues(eventOutput, operation, options, isWeekly)}
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
            onBlur: (e: any) => handleBlur(e),
          };

          const { title, days, startTime, endTime, value, color } = values;

          function renderTitle() {
            return (
              <div className={classes.input}>
                <TextField
                  {...defaultProps}
                  name="title"
                  label="Title"
                  value={title}
                  fullWidth
                  helperText={(touched.title && errors.title) || ''}
                  error={touched.title && Boolean(errors.title)}
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
                  value={days}
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
                  name="startTime"
                  value={startTime}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: options.step * 60, // 1 min
                  }}
                />
                <TextField
                  {...defaultProps}
                  label="End time"
                  type="time"
                  name="endTime"
                  value={endTime}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: options.step * 60, // 1 min
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
                  eventOutput={eventOutput}
                  onChange={(eventDates, error) => {
                    setFieldValue('dates', eventDates);
                    if (error) {
                      setFieldError('dates', error);
                      forceUpdate();
                    } else {
                      delete errors['dates'];
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
                          step: options.step * 60, // 1 min
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
              <DialogTitle id="customized-dialog-title" onAbort={onModalClose}>
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
                <Button variant="outlined" onClick={onModalClose}>
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
