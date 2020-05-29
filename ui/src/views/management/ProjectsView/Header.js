import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Breadcrumbs,
  IconButton,
  Grid,
  SvgIcon,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  File as FileIcon,
} from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {useDispatch} from "react-redux";
import {projectActions} from "../../../actions";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  root: {}
}));

function Header({className, ...rest}) {
  const classes = useStyles();

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
          aria-label="breadcrumb"
        >
          <Typography
            variant="body1"
            color="inherit"
          >
            Management
          </Typography>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Projects
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item>
        <Tooltip title="New Project" placement="top">
          <IconButton
            onClick={() => {
              dispatch(projectActions.openNewProjectDialog())
            }}>
            <SvgIcon
              fontSize="small">
              <FileIcon/>
            </SvgIcon>
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
