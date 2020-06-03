import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Grid,
  Typography,
  makeStyles, IconButton, MenuItem, Menu, Button
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Tooltip from "@material-ui/core/Tooltip";
import {
  CenterFocusStrong as CenterFocusStrongIcon,
  Clear as ClearIcon,
  Replay as ReplayIcon,
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
  },
  button: {
    textTransform: "none"
  },
  menu: {}
}));

const layouts = [
  {
    name: "cola", label: "Cola"
  },
  {
    name: "circle", label: "Circle"
  },
  {
    name: "concentric", label: "Concentric"
  },
  {
    name: "avsdf", label: "AVSDF"
  },
  {
    name: "cise", label: "CiSE"
  },
  {
    name: "cose", label: "CoSE"
  },
  {
    name: "cose-bilkent", label: "CoSE Bilkent"
  },
  {
    name: "fcose", label: "fCoSE"
  },
  {
    name: "grid", label: "Grid"
  },
  {
    name: "euler", label: "Euler"
  },
  {
    name: "spread", label: "Spread"
  },
  {
    name: "dagre", label: "Dagre"
  },
  {
    name: "klay", label: "Klay"
  },
  {
    name: "breadthfirst", label: "Breadth first"
  }
]

function Header({className, ...rest}) {
  const classes = useStyles();
  const actionRef = useRef(null);
  const [menuLayoutOpen, setLayoutMenuOpen] = useState(false);
  const {projectId} = useSelector(state => state.projectReducer);
  const {autoshowNodeDetails, layout} = useSelector(state => state.visualGraphReducer);
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
            <ClearIcon/>
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
        <Tooltip title="Refresh Layout" placement="top">
          <IconButton
            onClick={() => dispatch(visualGraphActions.refreshLayout())}>
            <ReplayIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Layout" placement="top">
          <Button
            className={classes.button}
            ref={actionRef}
            onClick={() => setLayoutMenuOpen(true)}>
            {layout ? layout.label : "Select Layout"}
          </Button>
        </Tooltip>
        <Menu
          anchorEl={actionRef.current}
          onClose={() => setLayoutMenuOpen(false)}
          open={menuLayoutOpen}
          PaperProps={{className: classes.menu}}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}>
          {layouts.map(l => (
            <MenuItem
              key={l.name}
              onClick={() => {
                dispatch(visualGraphActions.updateLayout(l));
                setLayoutMenuOpen(false);
              }}>
              {l.label}
            </MenuItem>
          ))}
        </Menu>

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
