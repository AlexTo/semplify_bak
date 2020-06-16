import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  ToggleButtonGroup,
  ToggleButton,
  Pagination
} from '@material-ui/lab';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import SearchHitCard from "./SearchHitCard";
import {useDispatch, useSelector} from "react-redux";
import {searchActions} from "../../../actions";

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    position: 'relative',
    '&:after': {
      position: 'absolute',
      bottom: -8,
      left: 0,
      content: '" "',
      height: 3,
      width: 48,
      backgroundColor: theme.palette.primary.main
    }
  },
  sortButton: {
    textTransform: 'none',
    letterSpacing: 0,
    marginRight: theme.spacing(2)
  }
}));

function Results({className, ...rest}) {
  const classes = useStyles();
  const [mode, setMode] = useState('grid');
  const dispatch = useDispatch();
  const {searchHits, total, offset, limit} = useSelector(state => state.searchReducer);

  const handleModeChange = (event, value) => {
    setMode(value);
  };

  const handlePageChange = (event, value) => {
    dispatch(searchActions.setOffset((value - 1) * limit));
  };

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        mb={2}
      >
        <Typography
          className={classes.title}
          variant="h5"
          color="textPrimary"
        >
          Showing
          {' '}
          {searchHits.length}
          {' '}
          results
        </Typography>
        <Box
          display="flex"
          alignItems="center"
        >
          <ToggleButtonGroup
            exclusive
            onChange={handleModeChange}
            size="small"
            value={mode}
          >
            <ToggleButton value="grid">
              <ViewModuleIcon/>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
      <Grid
        container
        spacing={3}
      >
        {searchHits.map((hit) => (
          <Grid
            item
            key={hit.node.value}
            md={mode === 'grid' ? 4 : 12}
            sm={mode === 'grid' ? 6 : 12}
            xs={12}
          >
            <SearchHitCard searchHit={hit}/>
          </Grid>
        ))}
      </Grid>
      <Box
        mt={6}
        display="flex"
        justifyContent="center"
      >
        <Pagination
          count={Math.ceil(total / limit)}
          page={(offset / limit) + 1}
          defaultPage={1}
          onChange={handlePageChange}
        />
      </Box>
    </div>
  );
}

Results.propTypes = {
  className: PropTypes.string
};

export default Results;
