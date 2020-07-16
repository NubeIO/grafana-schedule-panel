import React, { ChangeEvent } from 'react';
import { EventOutput, Operation, PanelOptions } from './types';

import { createStyles, Dialog, DialogActions, DialogContent, DialogTitle, Theme } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';
import TextField from '@material-ui/core/TextField/TextField';

import { makeStyles } from '@material-ui/core/styles';
import { DAY_MAP } from './utils';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

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
      minWidth: 170,
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

export default function EventModal(props: EventModalProps) {
  const { isOpenModal, isWeekly, operation, onModalClose, options } = props;
  const classes = useStyles();
  const handleDeleteEvent = () => {};
  const handleSubmit = (data: any) => {
    console.log(data);
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
        initialValues={{
          title: options.defaultTitle,
          days: [],
          startTime: '12:00',
          endTime: '12:00',
          value: options.min,
        }}
        validationSchema={Yup.object({
          title: Yup.string().required('Title is required'),
          days: Yup.array().min(1, 'Select at least a day'),
          value: Yup.number()
            .min(options.min, `Should be higher than ${options.min}`)
            .max(options.max, `Should be lower than ${options.max}`),
        })}
        onSubmit={handleSubmit}
      >
        {formikProps => {
          const { values, errors, touched, handleChange, handleBlur, setFieldValue, isValid } = formikProps;
          const defaultProps: any = {
            className: classes.input,
            variant: 'outlined',
            size: 'small',
            onChange: (e: any) => handleChange(e),
            onBlur: (e: any) => handleBlur(e),
          };

          const { title, days, startTime, endTime, value } = values;
          const handleChangeAutoComplete = (name: string, e: ChangeEvent<{}>, value: string[]) => {
            setFieldValue(name, value);
          };

          const handleChangeSlider = (name: string, e: ChangeEvent<{}>, value: number | number[]) => {
            setFieldValue(name, value);
          };

          function renderTitle() {
            return (
              <TextField
                {...defaultProps}
                name="title"
                label="Title"
                value={title}
                fullWidth
                helperText={(touched.title && errors.title) || ''}
                error={touched.title && Boolean(errors.title)}
              />
            );
          }

          function renderDays() {
            return (
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
                onChange={(e: ChangeEvent<{}>, value: string[]) => handleChangeAutoComplete('days', e, value)}
              />
            );
          }

          function renderStartEndTime() {
            return (
              <div {...defaultProps}>
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

          function renderValues() {
            return options.inputType === 'number' ? (
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
                  onChange={(e, v) => handleChangeSlider('value', e, v)}
                />
              </>
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
                  {renderDays()}
                  {renderStartEndTime()}
                  {renderValues()}
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
