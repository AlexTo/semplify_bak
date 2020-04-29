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
  makeStyles
} from '@material-ui/core';
import {
  Upload as UploadIcon,
} from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {useDispatch} from "react-redux";
import {importActions} from "../../../actions";

const useStyles = makeStyles((theme) => ({
  root: {},
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  },
  actionIcon: {
    marginRight: theme.spacing(1)
  }
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
            Data Integration
          </Typography>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Import
          </Typography>
        </Breadcrumbs>
        <Box mt={2}>
          <Button className={classes.action} onClick={() => {
            dispatch(importActions.openUploadForm())
          }}>
            <SvgIcon
              fontSize="small"
              className={classes.actionIcon}>
              <UploadIcon/>
            </SvgIcon>
            Upload
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
