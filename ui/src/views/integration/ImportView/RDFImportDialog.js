import React from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import {useForm} from "react-hook-form";

function RDFImportDialog({file, open, onClose, onSave}) {
  const {register, handleSubmit, errors} = useForm();

  const handleSave = (data) => {
    const {baseURI, graph} = data;
    onSave(file, baseURI, graph)
  }

  if (!file) return null;

  return (
    <Dialog open={open} onClose={onClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md" fullWidth>
      <DialogTitle>Import file</DialogTitle>
      <DialogContent>
        <Box p={1}>
          <TextField autoFocus name="baseURI" label="Base URI" fullWidth
                     defaultValue={`file:/uploaded/generated/${file.filename}`}
                     error={Boolean(errors.baseURI)}
                     helperText={errors.baseURI && errors.baseURI.message}
                     inputRef={register({required: "Base URI is required"})}/>
        </Box>
        <Box p={1}>
          <TextField name="graph" label="Graph"
                     fullWidth inputRef={register({required: "Target graph is required"})}/>
        </Box>

      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit(handleSave)}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RDFImportDialog;
