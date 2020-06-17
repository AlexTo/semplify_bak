import React from 'react';
import {
  Grid,
  IconButton,
  Tooltip
} from '@material-ui/core';
import {
  Save as SaveIcon,
  FolderOpen as OpenIcon,
  PlayArrow as PlayArrowIcon
} from '@material-ui/icons';
import {sparqlActions} from "../../../actions/sparqlActions";
import {useDispatch, useSelector} from "react-redux";
import {queryService, yasqeService} from "../../../services";
import {useSnackbar} from "notistack";

function Toolbar() {

  const dispatch = useDispatch()
  const {currentTab} = useSelector(state => state.sparqlReducer);
  const {projectId} = useSelector(state => state.projectReducer);
  const {enqueueSnackbar} = useSnackbar();

  const handleOnExecute = () => {
    dispatch(sparqlActions.execute());
  }

  const handleSave = () => {
    if (!currentTab.serverId) {
      dispatch(sparqlActions.openSaveQueryDialog());
    } else {
      const query = yasqeService.getQuery(currentTab.key);
      queryService.update(currentTab.serverId, projectId, currentTab.title, currentTab.description, query)
        .then(_ => enqueueSnackbar("Query saved successfully", {
          variant: "success"
        }));
    }
  }

  const handleOpen = () => {
    dispatch(sparqlActions.openOpenQueryDialog());
  }

  return (
    <Grid alignItems="center" container justify="space-between">
      <Grid item/>
      <Grid item>
        <Tooltip title="Execute" placement="top">
          <IconButton
            onClick={handleOnExecute}>
            <PlayArrowIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Save" placement="top">
          <IconButton
            onClick={handleSave}>
            <SaveIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Open" placement="top">
          <IconButton
            onClick={handleOpen}>
            <OpenIcon/>
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}

export default Toolbar;
