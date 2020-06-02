import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Grid,
  Typography,
  makeStyles, IconButton
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Tooltip from "@material-ui/core/Tooltip";
import {
  CenterFocusStrong as CenterFocusStrongIcon,
  Autorenew as AutorenewIcon,
  Save as SaveIcon,
  Menu as MenuIcon,
  AspectRatio as AspectRatioIcon,
  Settings as SettingsIcon
} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {visualGraphActions} from "../../../actions";
import {ToggleButton} from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {},
  toggleButton: {
    border: "none"
  }
}));

function Header({className, ...rest}) {
  const classes = useStyles();
  const {projectId} = useSelector(state => state.projectReducer);
  const {autoshowNodeDetails} = useSelector(state => state.visualGraphReducer);
  const dispatch = useDispatch();
  return (
    <Grid
      container
      spacing={3}
      justify="space-between"
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid item>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small"/>}
          aria-label="breadcrumb">
          <Typography
            variant="body1"
            color="inherit">
            Explore
          </Typography>
          <Typography
            variant="body1"
            color="textPrimary">
            Visual Graph
          </Typography>
        </Breadcrumbs>
      </Grid>
      {projectId && <Grid item>
        <Tooltip title="Save Graph" placement="top">
          <IconButton
            onClick={() => {
            }}>
            <SaveIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Settings" placement="top">
          <IconButton
            onClick={() => dispatch(visualGraphActions.openUserSettingsDialog())}>
            <SettingsIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Clear" placement="top">
          <IconButton
            onClick={() => dispatch(visualGraphActions.clear())}>
            <AutorenewIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Fit" placement="top">
          <IconButton
            onClick={() => dispatch(visualGraphActions.fit())}>
            <AspectRatioIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Center Forcus" placement="top">
          <IconButton
            onClick={() => dispatch(visualGraphActions.centerFocus())}>
            <CenterFocusStrongIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Autoshow Node Details" placement="top">
          <ToggleButton
            className={classes.toggleButton}
            selected={autoshowNodeDetails}
            value="auto-show-node-details"
            onChange={() => dispatch(visualGraphActions.toggleAutoshowNodeDetails())}>
            <MenuIcon/>
          </ToggleButton>
        </Tooltip>
      </Grid>}
    </Grid>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
