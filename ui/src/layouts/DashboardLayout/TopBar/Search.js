import React from 'react';
import {
  IconButton,
  SvgIcon,
  Tooltip
} from '@material-ui/core';
import {
  Search as SearchIcon
} from 'react-feather';

function Search() {

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
