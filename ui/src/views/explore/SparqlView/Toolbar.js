import React from 'react';
import {
  Grid,
  IconButton,
  Tooltip,

  makeStyles
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const useStyles = makeStyles(() => ({
  root: {}
}));

function Toolbar({onExecute, onSave}) {
  const classes = useStyles();

  return (
    <Grid alignItems="center" container justify="space-between">
      <Grid item/>
      <Grid item>
        <Tooltip title="Execute">
          <IconButton
            onClick={onExecute}>
            <PlayArrowIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Save">
          <IconButton
            onClick={onSave}>
            <SaveIcon/>
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}

export default Toolbar;
