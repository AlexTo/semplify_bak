import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NodeSearch from "../../../components/NodeSearch";

const useStyles = makeStyles((theme) => ({
  root: {},
  actionIcon: {
    marginRight: theme.spacing(1)
  }
}));

function Header({className, ...rest}) {
  const classes = useStyles();

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
            color="inherit">
            Explore
          </Typography>
          <Typography
            variant="body1"
            color="textPrimary">
            SPARQL
          </Typography>
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
