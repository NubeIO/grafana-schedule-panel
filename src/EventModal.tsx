import React, { ChangeEvent } from 'react';
import { EventOutput, Operation } from './types';

import { createStyles, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';
import TextField from '@material-ui/core/TextField/TextField';

import { makeStyles } from '@material-ui/core/styles';
import { DAY_MAP } from './utils';

const dayOptions = Object.values(DAY_MAP);

const useStyles = makeStyles(() =>
  createStyles({
    body: {
      width: '100%',
    },
    input: {
      marginBottom: '20px',
    },
  })
);

interface EventModalProps {
  isOpenModal: boolean;
  isWeekly: boolean;
  operation: Operation;
  eventOutput: EventOutput | null;
  onModalClose: () => void;
}

export default function EventModal(props: EventModalProps) {
  const { isOpenModal, isWeekly, operation, onModalClose } = props;
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
        initialValues={{ title: '', days: [] }}
        validationSchema={Yup.object({
          title: Yup.string().required('Title is required'),
          days: Yup.array().min(1, 'Select at least a day'),
        })}
        onSubmit={handleSubmit}
      >
        {props => {
          const { values, errors, touched, handleChange, handleBlur, setFieldValue, isValid } = props;
          const { title, days } = values;
          const onChangeAutoComplete = (name: string, e: ChangeEvent<{}>, value: string[]) => {
            setFieldValue(name, value);
            handleChange(e);
          };

          function renderTitle() {
            return (
              <TextField
                className={classes.input}
                name="title"
                label="Title"
                value={title}
                fullWidth
                variant="outlined"
                size="small"
                helperText={(touched.title && errors.title) || ''}
                error={touched.title && Boolean(errors.title)}
                onChange={handleChange}
                onBlur={handleBlur}
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
                onChange={(e: ChangeEvent<{}>, value: string[]) => onChangeAutoComplete('days', e, value)}
              />
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
