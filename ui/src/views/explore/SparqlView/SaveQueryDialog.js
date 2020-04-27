import React from 'react';
import {Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {useForm} from "react-hook-form";

function SaveQueryDialog({label, description, open, onClose, onSave}) {

  const {register, handleSubmit, errors} = useForm();

  const handleSave = (data) => {
    const {label, description} = data;
    onSave(label, description);
  };

  return (
    <Dialog open={open} onClose={onClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md" fullWidth>
      <DialogTitle>Save query</DialogTitle>
      <DialogContent>
        <Box p={1}>
          <TextField autoFocus name="label" label="Label" fullWidth
                     defaultValue={label}
                     error={Boolean(errors.label)}
                     helperText={errors.label && errors.label.message}
                     inputRef={register({required: "Label is required"})}/>
        </Box>
        <Box p={1}>
          <TextField name="description" label="Description"
                     defaultValue={description}
                     fullWidth multiline rows={5}
                     inputRef={register}/>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit(handleSave)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SaveQueryDialog;
