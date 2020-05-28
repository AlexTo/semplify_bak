import React from 'react';
import {
  Grid,
  IconButton,
  Tooltip
} from '@material-ui/core';
import {
  Save as SaveIcon,
  PlayArrow as PlayArrowIcon
} from '@material-ui/icons';

function Toolbar({onExecute, onSave}) {

  return (
    <Grid alignItems="center" container justify="space-between">
      <Grid item/>
      <Grid item>
        <Tooltip title="Execute" placement="top">
          <IconButton
            onClick={onExecute}>
            <PlayArrowIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Save" placement="top">
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
