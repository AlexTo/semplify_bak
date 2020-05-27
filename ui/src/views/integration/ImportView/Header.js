import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  SvgIcon,
  Typography,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import {
  Upload as UploadIcon,
} from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {useDispatch, useSelector} from "react-redux";
import {importActions} from "../../../actions";

const useStyles = makeStyles((theme) => ({
  root: {},
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  }
}));

function Header({className, ...rest}) {
  const classes = useStyles();
  const {projectId} = useSelector(state => state.projectReducer);
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
            Data Integration
          </Typography>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Import
          </Typography>
        </Breadcrumbs>
      </Grid>
      {projectId && <Grid item>
        <Tooltip title="Upload" placement="top">
          <Button className={classes.action}
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    dispatch(importActions.openUploadDialog())
                  }}>
            <SvgIcon>
              <UploadIcon/>
            </SvgIcon>
          </Button>
        </Tooltip>
      </Grid>}
    </Grid>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
