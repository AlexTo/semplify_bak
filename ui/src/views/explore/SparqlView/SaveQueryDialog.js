import React from 'react';
import {Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {sparqlActions} from "../../../actions/sparqlActions";
import {queryService, yasqeService} from "../../../services";
import {useSnackbar} from "notistack";

function SaveQueryDialog() {

  const {register, handleSubmit, errors} = useForm();
  const dispatch = useDispatch();
  const {currentTab, saveQueryDialogOpen} = useSelector(state => state.sparqlReducer);
  const {projectId} = useSelector(state => state.projectReducer);
  const {enqueueSnackbar} = useSnackbar();

  const handleSave = (data) => {
    const {title, description} = data;
    const query = yasqeService.getQuery(currentTab.key);
    queryService.create(projectId, title, description, query)
      .then(result => {
        handleClose();
        enqueueSnackbar("Query saved successfully", {
          variant: "success"
        });
        dispatch(sparqlActions.updateCurrentTab(
          result.id, result.title, result.description
        ))
      });

  };

  const handleClose = () => {
    dispatch(sparqlActions.closeSaveQueryDialog())
  }

  if (!currentTab) return null;

  return (
    <Dialog open={saveQueryDialogOpen} onClose={handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md" fullWidth>
      <DialogTitle>Save query</DialogTitle>
      <DialogContent>
        <Box p={1}>
          <TextField autoFocus name="title" label="Title" fullWidth
                     defaultValue={currentTab.title}
                     error={Boolean(errors.title)}
                     helperText={errors.title && errors.title.message}
                     inputRef={register({required: "Title is required"})}/>
        </Box>
        <Box p={1}>
          <TextField name="description" label="Description"
                     defaultValue={currentTab.description}
                     fullWidth multiline rows={5}
                     inputRef={register}/>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
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
