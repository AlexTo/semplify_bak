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
import {useDebounce} from "../../../hooks";
import {Search as SearchIcon} from "react-feather";
import {entityHubQueries} from "../../../graphql";
import {useSelector, useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import {visualGraphActions} from "../../../actions";

const renderOption = (option) => <Grid container spacing={1}>
  <Grid item>
    {option.node.depiction && <Avatar src={option.node.depiction.value}/>}
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

function NodeSearch() {
  const classes = useStyles();

  const {enqueueSnackbar} = useSnackbar();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const {projectId} = useSelector(state => state.projectReducer);
  const dispatch = useDispatch();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [load, {called, loading, data}] = useLazyQuery(entityHubQueries.searchSubjs,
    {
      fetchPolicy: "no-cache"
    });

  useEffect(() => {
    setSearchTerm("");
  }, [projectId])

  useEffect(() => {
    if (!debouncedSearchTerm) {
      return;
    }
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
        limit: 100,
        offset: 0
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);


  useEffect(() => {
    if (!open) {
      setOptions([]);
      return;
    }
    if (data && data.searchSubjs) {
      setOptions(data.searchSubjs.searchHits);
    }
  }, [open, data]);

  const handleOptionSelected = (value) => {
    if (!value)
      return;
    dispatch(visualGraphActions.addNode(value.node));
  }

  return (
    <Autocomplete
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event, value) => handleOptionSelected(value)}
      getOptionLabel={() => ""}
      filterOptions={(x) => x}
      options={options}
      loading={called && loading}
      noOptionsText="Enter 3 characters or more to search ..."
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
