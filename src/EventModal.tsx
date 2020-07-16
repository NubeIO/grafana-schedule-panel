import React from 'react';
import Button from '@material-ui/core/Button';
import { EventOutput, Operation } from './types';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

interface EventModalProps {
  isOpenModal: boolean;
  isWeekly: boolean;
  operation: Operation;
  eventOutput: EventOutput | null;
  onModalClose: () => void;
}

export default function EventModal(props: EventModalProps) {
  const { isOpenModal, isWeekly, operation, onModalClose } = props;

  const deleteEvent = () => {};
  const saveEvent = () => {};

  const body = <div>Here It Goes</div>;

  return (
    <Dialog
      fullWidth={true}
      maxWidth="md"
      onClose={onModalClose}
      aria-labelledby="customized-dialog-title"
      open={isOpenModal}
    >
      <DialogTitle id="customized-dialog-title" onAbort={onModalClose}>
        {operation === 'add' ? 'Add' : 'Edit'} {isWeekly ? 'Weekly ' : ''}Event
      </DialogTitle>
      <DialogContent dividers>{body}</DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onModalClose}>
          Close
        </Button>
        {operation === 'edit' && (
          <Button variant="outlined" color="secondary" onClick={deleteEvent}>
            Delete
          </Button>
        )}
        <Button variant="outlined" color="primary" onClick={saveEvent}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
