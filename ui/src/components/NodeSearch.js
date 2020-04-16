import React, {Fragment, useEffect, useState} from "react";
import {Autocomplete} from "@material-ui/lab";
import {
  Box,
  makeStyles,
  Paper,
  SvgIcon,
  TextField,
  CircularProgress,
  Typography,
  Grid,
  Avatar
} from "@material-ui/core";
import {useLazyQuery} from "@apollo/react-hooks";
import {useDebounce} from "../hooks";
import {Search as SearchIcon} from "react-feather";
import {entityHubQueries} from "../graphql";
import {useSelector} from "react-redux";
import {useSnackbar} from "notistack";

const renderOption = (option) => <Grid container spacing={1}>
  <Grid item>
    {option.node.thumbnailUri && <Avatar alt={option.node.prefLabel} src={option.node.thumbnailUri}/>}
  </Grid>
  <Grid item xs>
    {option.node.prefLabel.value}
    <Typography variant="body2" color="textSecondary">
      {option.node.value}
    </Typography>
  </Grid>
</Grid>;

const useStyles = makeStyles((theme) => ({
  root: {},
  searchBox: {
    marginRight: theme.spacing(2)
  },
  searchInput: {
    marginLeft: theme.spacing(2)
  }
}));

function NodeSearch({onOptionSelected}) {
  const classes = useStyles();

  const {enqueueSnackbar} = useSnackbar();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const projectReducer = useSelector(state => state.projectReducer);
  const {projectId} = projectReducer;
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [load, {called, loading, data}] = useLazyQuery(entityHubQueries.searchNodes, {
    fetchPolicy: "no-cache"
  });

  useEffect(() => {
    setSearchTerm("");
  }, [projectId])

  useEffect(() => {
    if (debouncedSearchTerm) {
      if (debouncedSearchTerm.length < 3) {
        setOptions([]);
        return;
      }

      if (projectId === "") {
        enqueueSnackbar('Please select a project', {
          variant: 'warning'
        })
        return;
      }

      load({
        variables: {
          projectId,
          term: debouncedSearchTerm,
        }
      })
    }
  }, [debouncedSearchTerm]);


  useEffect(() => {
    if (!open) {
      setOptions([]);
      return;
    }
    if (data && data.searchNodes) {
      setOptions(data.searchNodes);
    }
  }, [open, data]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event, value) => onOptionSelected(value)}
      getOptionLabel={() => ""}
      filterOptions={(x) => x}
      options={options}
      loading={called & loading}
      noOptionsText="Enter 3 characters or more ..."
      renderOption={renderOption}
      renderInput={params => (
        <Paper
          component={Box}
          className={classes.searchBox}
          display="flex"
          alignItems="center"
          variant="outlined"
          py={0.5}
          px={1}>
          <SvgIcon
            color="action"
            fontSize="small">
            <SearchIcon/>
          </SvgIcon>
          <TextField
            {...params}
            placeholder="Search"
            className={classes.searchInput}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? <CircularProgress color="inherit" size={20}/> : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
              autoComplete: 'new-password',
              disableUnderline: true
            }}
          />
        </Paper>)}/>
  )
}

export default NodeSearch;
