import React from 'react';
import { Form, Formik } from 'formik';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Holiday } from 'components/holiday/holiday.model';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { PanelOptions, RawData } from 'types';
import TextField from 'components/common/textField';
import ColorSelectorField from '../../common/colorSelectorField';
import SliderValueField from 'components/common/sliderValueField';
import DateSelectorField from 'components/common/dateSelectorField';
import * as holidayService from 'components/holiday/holiday.service';
import holidayFormValidation from 'components/holiday/holiday.validation';

interface Props {
  id: string;
  dialogTitle: string;
  isAddForm: boolean | undefined;
  initialValues: any;
  onSubmit: (holiday: Holiday) => void;
  onDelete: (e: any) => void;
  onClose: () => void;
  options: PanelOptions;
}

function HolidayFormUi(props: Props) {
  const { id, dialogTitle, isAddForm, initialValues, onSubmit, onClose, onDelete, options } = props;

  return (
    <Formik initialValues={initialValues} validationSchema={holidayFormValidation(options)} onSubmit={onSubmit}>
      {({ values, setFieldValue, errors, touched, isValid }) => (
        <Form>
          <DialogTitle id={id}>{dialogTitle}</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="name"
                label="Title"
                onChange={e => setFieldValue('name', e.target.value)}
                value={values.name}
                touched={touched}
                errors={errors}
              />
              <DateSelectorField
                name="date"
                label="Date"
                value={values.date}
                errors={errors}
                touched={touched}
                onChange={(date: any) => setFieldValue('date', date)}
              />
              <SliderValueField
                min={options.min}
                max={options.max}
                step={options.step}
                label="Value"
                errors={errors}
                touched={touched}
                value={values.value}
                name="value"
                onChange={(e: any, v: any) => setFieldValue('value', v)}
              />
              <ColorSelectorField
                name="holiday-color-field"
                value={values.color}
                onChange={(color: string) => setFieldValue('color', color)}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
            {!isAddForm && (
              <Button variant="outlined" color="secondary" onClick={onDelete}>
                Delete
              </Button>
            )}
            <Button variant="outlined" color="primary" type="submit" disabled={!isValid}>
              Save
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
}

const getInitialFormValues = (isAddForm: boolean | undefined, holiday: Holiday) => {
  if (isAddForm) {
    return {
      id: null,
      name: null,
      date: null,
      value: null,
      color: '',
    };
  }

  return {
    id: holiday.id,
    name: holiday.name,
    date: holiday.date,
    value: holiday.value,
    color: holiday.color,
  };
};

interface HolidayFormProps {
  syncData: any;
  value: RawData;
  closeGenericDialog: () => void;
  isAddForm: boolean | undefined;
  holiday: Holiday;
  id: string;
  dialogTitle: string;
  initialValues: any;
  onSubmit: (holiday: Holiday) => void;
  onClose: () => void;
  onEdit: () => void;
  options: PanelOptions;
}

function HolidayForm(props: HolidayFormProps) {
  function handleCreateHoliday(values: any) {
    const newHoliday = holidayService.create(values.name, values.color, values.date, values.value);
    const updatedData = holidayService.updateData(newHoliday, props.value);
    props.syncData(updatedData);
    props.closeGenericDialog();
  }

  function handleUpdateHoliday(id: string, holiday: Holiday) {
    const updatedHoliday = holidayService.updateData({ id, ...holiday }, props.value);
    props.syncData(updatedHoliday);
    props.closeGenericDialog();
  }

  function handleDeleteHoliday() {
    delete props.value.yearly[props.holiday.id];
    props.syncData(props.value);
    props.closeGenericDialog();
  }

  function onSubmit(values: Holiday) {
    if (props.isAddForm) {
      return handleCreateHoliday(values);
    }
    handleUpdateHoliday(props.holiday.id, values);
  }
  const initialFormValues = getInitialFormValues(props.isAddForm, props.holiday);

  return (
    <HolidayFormUi {...props} onSubmit={onSubmit} onDelete={handleDeleteHoliday} initialValues={initialFormValues} />
  );
}

export default HolidayForm;
