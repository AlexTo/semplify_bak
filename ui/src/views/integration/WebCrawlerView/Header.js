import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  SvgIcon,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  PlusCircle as PlusCircleIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {useDispatch} from "react-redux";
import {webCrawlerActions} from "../../../actions";

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
            Web Crawler
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          Crawled Pages
        </Typography>
        <Box mt={2}>
          <Button className={classes.action}>
            <SvgIcon
              fontSize="small"
              className={classes.actionIcon}
            >
              <UploadIcon/>
            </SvgIcon>
            Import
          </Button>
          <Button className={classes.action}>
            <SvgIcon
              fontSize="small"
              className={classes.actionIcon}
            >
              <DownloadIcon/>
            </SvgIcon>
            Export
          </Button>
        </Box>
      </Grid>
      <Grid item>
        <Button
          color="secondary"
          variant="contained"
          className={classes.action}
          onClick={() => dispatch(webCrawlerActions.openNewCrawl())}
        >
          <SvgIcon
            fontSize="small"
            className={classes.actionIcon}
          >
            <PlusCircleIcon/>
          </SvgIcon>
          Crawl
        </Button>
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
