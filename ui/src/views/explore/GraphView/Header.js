import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Grid,
  Typography,
  makeStyles, IconButton, SvgIcon
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Tooltip from "@material-ui/core/Tooltip";
import {Autorenew as AutorenewIcon, Save as SaveIcon} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {visualGraphActions} from "../../../actions";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

function Header({className, ...rest}) {
  const classes = useStyles();
  const {projectId} = useSelector(state => state.projectReducer)
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
        <Tooltip title="Clear Graph" placement="top">
          <IconButton
            onClick={() => dispatch(visualGraphActions.clear())}>
            <AutorenewIcon/>
          </IconButton>
        </Tooltip>
      </Grid>}
    </Grid>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
