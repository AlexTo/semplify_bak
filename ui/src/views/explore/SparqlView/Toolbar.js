import React from 'react';
import {
  Grid,
  IconButton,
  Tooltip
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

function Toolbar({onExecute, onSave}) {

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
