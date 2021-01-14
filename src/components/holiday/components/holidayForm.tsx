import React from 'react';
import { Form, Formik } from 'formik';
import _cloneDeep from 'lodash/cloneDeep';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';

import { PanelOptions, RawData } from 'types';
import DeleteButton from 'components/DeleteButton';
import { Holiday } from 'components/holiday/holiday.model';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ColorSelectorField from '../../common/colorSelectorField';
import SliderValueField from 'components/common/sliderValueField';
import DateSelectorField from 'components/common/dateSelectorField';
import * as holidayService from 'components/holiday/holiday.service';
import holidayFormValidation from 'components/holiday/holiday.validation';
import CreatableSelectField from 'components/common/creatableSelectField';
import { createFilterOptions } from '@material-ui/lab/useAutocomplete';
import { ScheduleName } from 'components/scheduleName/scheduleName.model';
import * as scheduleNameActions from 'components/scheduleName/scheduleName.action';

interface Props {
  id: string;
  dialogTitle: string;
  isAddForm: boolean | undefined;
  initialValues: any;
  onSubmit: (holiday: any) => void;
  onDelete: (e: any) => void;
  onClose: () => void;
  options: PanelOptions;
  scheduleNames: ScheduleName[];
  updateScheduleName: (action: string, value: string) => void;
}

const autoCompleteFilter = createFilterOptions<ScheduleName>();

function HolidayFormUi(props: Props) {
  const {
    id,
    dialogTitle,
    isAddForm,
    initialValues,
    onSubmit,
    onClose,
    onDelete,
    options,
    updateScheduleName,
    scheduleNames,
  } = props;

  const renderScheduleDeleteButton = (id: string | null) => {
    if (id == null) {
      return null;
    }
    return (
      <DeleteButton
        stopPropagation={true}
        onClick={() => updateScheduleName(scheduleNameActions.DELETE_SCHEDULE_NAME, id)}
      />
    );
  };

  return (
    <Formik initialValues={initialValues} validationSchema={holidayFormValidation(options)} onSubmit={onSubmit}>
      {({ values, setFieldValue, errors, touched, isValid }) => (
        <Form>
          <DialogTitle id={id}>{dialogTitle}</DialogTitle>
          <DialogContent>
            <form>
              <CreatableSelectField
                options={scheduleNames}
                name="name"
                label="Title"
                value={values.name}
                touched={touched}
                errors={errors}
                listItemButton={renderScheduleDeleteButton}
                autoCompleteFilter={autoCompleteFilter}
                onChange={(e: any, newValue: any) => {
                  if (!newValue) {
                    setFieldValue('name', null);
                  } else if (typeof newValue === 'string') {
                    updateScheduleName(scheduleNameActions.CREATE_SCHEDULE_NAME, newValue);
                    setFieldValue('name', newValue);
                  } else if (newValue && newValue.inputValue) {
                    updateScheduleName(scheduleNameActions.CREATE_SCHEDULE_NAME, newValue.inputValue);
                    setFieldValue('name', newValue.inputValue);
                  } else if (newValue && newValue.name) {
                    setFieldValue('name', newValue.name);
                  }
                }}
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
  scheduleNames: ScheduleName[];
  updateScheduleName: (action: string, value: string) => void;
}

function HolidayForm(props: HolidayFormProps) {
  function handleCreateHoliday(values: any, output: RawData) {
    const newHoliday = holidayService.getHolidayInstance(null, values.name, values.color, values.date, values.value);
    const updatedData = holidayService.updateData(newHoliday, output);
    props.syncData(updatedData);
    props.closeGenericDialog();
  }

  function handleUpdateHoliday(id: string, holiday: Holiday, output: RawData) {
    const { name, color, date, value } = holiday;
    const updatedHoliday = holidayService.getHolidayInstance(id, name, color, date, value);
    props.syncData(holidayService.updateData(updatedHoliday, output));
    props.closeGenericDialog();
  }

  function handleDeleteHoliday() {
    delete props.value.yearly[props.holiday.id];
    props.syncData(props.value);
    props.closeGenericDialog();
  }

  function onSubmit(values: Holiday) {
    let output: RawData = _cloneDeep(props.value) || {};
    if (props.isAddForm) {
      return handleCreateHoliday(values, output);
    }
    handleUpdateHoliday(props.holiday.id, values, output);
  }

  const initialFormValues = getInitialFormValues(props.isAddForm, props.holiday);

  return (
    <HolidayFormUi {...props} onSubmit={onSubmit} onDelete={handleDeleteHoliday} initialValues={initialFormValues} />
  );
}

export default HolidayForm;
