import React from 'react';
import {
  IconButton,
  SvgIcon,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import {
  Search as SearchIcon
} from 'react-feather';

const useStyles = makeStyles(() => ({}));

function Search() {
  const classes = useStyles();

  return (
    <Tooltip title="Search">
      <IconButton
        color="inherit"
        onClick={() => {
        }}
      >
        <SvgIcon fontSize="small">
          <SearchIcon/>
        </SvgIcon>
      </IconButton>
    </Tooltip>
  );
}

export default Search;
