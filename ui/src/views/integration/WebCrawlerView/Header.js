import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Breadcrumbs,
  IconButton,
  Grid,
  SvgIcon,
  Typography,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import {
  Public as PublicIcon,
} from '@material-ui/icons';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {useDispatch, useSelector} from "react-redux";
import {webCrawlerActions} from "../../../actions";

const useStyles = makeStyles((theme) => ({
  root: {},
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
            Web Crawler
          </Typography>
        </Breadcrumbs>
      </Grid>
      {projectId && <Grid item>
        <Tooltip title="Crawl" placement="top">
          <IconButton
            onClick={() => dispatch(webCrawlerActions.openNewCrawl())}>
            <PublicIcon/>
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
