import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";

function OkCancelDialog({message, open, onClose, onOk}) {

  return (
    <Dialog open={open} onClose={onClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md" fullWidth>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        {message}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={onOk}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OkCancelDialog;
