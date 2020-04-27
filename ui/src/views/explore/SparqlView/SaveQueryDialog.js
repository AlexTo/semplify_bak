import React from 'react';
import {Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {useForm} from "react-hook-form";

function SaveQueryDialog({title, description, open, onClose, onSave}) {

  const {register, handleSubmit, errors} = useForm();

  const handleSave = (data) => {
    const {title, description} = data;
    onSave(title, description);
  };

  return (
    <Dialog open={open} onClose={onClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md" fullWidth>
      <DialogTitle>Save query</DialogTitle>
      <DialogContent>
        <Box p={1}>
          <TextField autoFocus name="title" label="Title" fullWidth
                     defaultValue={title}
                     error={Boolean(errors.title)}
                     helperText={errors.title && errors.title.message}
                     inputRef={register({required: "Title is required"})}/>
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
