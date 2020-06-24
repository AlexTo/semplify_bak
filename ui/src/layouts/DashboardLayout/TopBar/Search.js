import React, {useState} from 'react';
import {
  SvgIcon,
  makeStyles, Button
} from '@material-ui/core';
import {
  Search as SearchIcon
} from 'react-feather';
import {TextField, InputAdornment} from "@material-ui/core";
import {useHistory} from "react-router";
import {useSnackbar} from "notistack";
import {useDispatch} from "react-redux";
import {searchActions} from "../../../actions";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    margin: theme.spacing(1),
  },
  input: {
    color: "inherit"
  }
}));

function Search() {
  const classes = useStyles();
  const [value, setValue] = useState('');
  const dispatch = useDispatch();
  const {enqueueSnackbar} = useSnackbar();
  const history = useHistory();

  const handleSearch = () => {
    if (value.trim().length < 3) {
      enqueueSnackbar("Please try a longer search term", {
        variant: "warning"
      });
      return;
    }
    dispatch(searchActions.setOffset(0));
    history.push({pathname: "/search", search: `?q=${value}&t=${Date.now()}`});
  }

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField
        className={classes.input}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
            e.preventDefault();
          }
        }}
        fullWidth
        InputProps={{
          className: classes.input,
          startAdornment: (
            <InputAdornment position="start">
              <SvgIcon
                fontSize="small"
              >
                <SearchIcon/>
              </SvgIcon>
            </InputAdornment>
          )
        }}
        onChange={e => setValue(e.target.value)}
        placeholder="Search"
        value={value}
        variant="outlined"
        size="small"
      /></form>
  );
}

export default Search;
