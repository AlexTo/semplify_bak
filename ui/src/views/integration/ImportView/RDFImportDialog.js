import React from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {importActions} from "../../../actions";
import {taskService} from "../../../services";
import {useSnackbar} from "notistack";

function RDFImportDialog() {
  const {register, handleSubmit, errors} = useForm();
  const dispatch = useDispatch();
  const {enqueueSnackbar} = useSnackbar();
  const {projectId} = useSelector(state => state.projectReducer);
  const {importFormOpen, fileToImport} = useSelector(state => state.importReducer);

  const handleSave = (data) => {
    const {baseURI, graph} = data;
    taskService.importRDF(projectId, fileToImport.id, graph, baseURI, false)
      .then(_ => {
        enqueueSnackbar("RDF import  task has been queued.", {
          variant: "success"
        });
        handleClose();
      });
  }

  const handleClose = () => {
    dispatch(importActions.closeImportForm());
  }

  if (!fileToImport) return null;

  return (
    <Dialog open={importFormOpen} onClose={handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md" fullWidth>
      <DialogTitle>Import file</DialogTitle>
      <DialogContent>
        <Box p={1}>
          <TextField autoFocus name="baseURI" label="Base URI" fullWidth
                     defaultValue={`file:/uploaded/generated/${fileToImport.filename}`}
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
        <Button color="secondary"
                size="small"
                onClick={handleClose}>
          Cancel
        </Button>
        <Button color="primary"
                variant="contained"
                size="small"
                onClick={handleSubmit(handleSave)}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RDFImportDialog;
