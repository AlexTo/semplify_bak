/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Checkbox,
  InputAdornment,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  makeStyles
} from '@material-ui/core';
import {
  Trash as TrashIcon,
  Search as SearchIcon
} from 'react-feather';
import {useMutation, useQuery} from "@apollo/react-hooks";
import {useSelector} from "react-redux";
import {entityHubQueries} from "../../../graphql";
import OkCancelDialog from "../../../components/ConfirmationDialog";

const sortOptions = [
  {
    value: 'updatedAt|desc',
    label: 'Last update (newest first)'
  },
  {
    value: 'updatedAt|asc',
    label: 'Last update (oldest first)'
  },
  {
    value: 'createdAt|desc',
    label: 'Creation date (newest first)'
  },
  {
    value: 'createdAt|asc',
    label: 'Creation date (oldest first)'
  }
];

function applyFilters(graphs, query, filters) {
  return graphs.filter((p) => {
    return true;
  });
}

function applyPagination(graphs, page, limit) {
  return graphs.slice(page * limit, page * limit + limit);
}

const useStyles = makeStyles((theme) => ({
  root: {},
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  queryField: {
    width: 500
  },
  categoryField: {
    flexBasis: 200
  },
  availabilityField: {
    marginLeft: theme.spacing(2),
    flexBasis: 200
  },
  stockField: {
    marginLeft: theme.spacing(2)
  },
  shippableField: {
    marginLeft: theme.spacing(2)
  },
  imageCell: {
    fontSize: 0,
    width: 68,
    flexBasis: 68,
    flexGrow: 0,
    flexShrink: 0
  },
  image: {
    height: 68,
    width: 68
  }
}));

function Results({className, ...rest}) {
  const classes = useStyles();
  const [selectedGraphs, setSelectedGraphs] = useState([]);
  const [page, setPage] = useState(0);
  const [graphs, setGraphs] = useState([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const {projectId} = useSelector(state => state.projectReducer);
  const {data, refetch} = useQuery(entityHubQueries.graphs, {
    variables: {
      projectId
    }
  });

  const [deleteGraphs] = useMutation(entityHubQueries.deleteGraphs)

  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    domain: null,
  });

  useEffect(() => {
    if (!data) {
      setGraphs([])
      return;
    }
    setGraphs(data.graphs);
  }, [data])

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    event.persist();
    setSort(event.target.value);
  };

  const handleSelectAll = (event) => {
    setSelectedGraphs(event.target.checked
      ? graphs.map((g) => g.value)
      : []);
  };

  const handleSelectOne = (event, uri) => {
    if (!selectedGraphs.includes(uri)) {
      setSelectedGraphs((prevSelected) => [...prevSelected, uri]);
    } else {
      setSelectedGraphs((prevSelected) => prevSelected.filter((id) => id !== uri));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const filteredList = applyFilters(graphs, query, filters);
  const paginatedList = applyPagination(filteredList, page, limit);
  const enableBulkOperations = selectedGraphs.length > 0;
  const selectedSome = selectedGraphs.length > 0 && selectedGraphs.length < graphs.length;
  const selectedAll = selectedGraphs.length === graphs.length;


  const handleDelete = (graphs) => {
    setSelectedGraphs(graphs);
    setDeleteDialogOpen(true);
  }

  const handleDeleteConfirm = () => {
    deleteGraphs({
      variables: {
        projectId,
        graphs: selectedGraphs
      }
    }).then(() => {
      refetch().then(() => {
        setSelectedGraphs([]);
        setDeleteDialogOpen(false);
      });
    })
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box p={2}>
        <Box
          display="flex"
          alignItems="center"
        >
          <TextField
            className={classes.queryField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon
                    fontSize="small"
                    color="action">
                    <SearchIcon/>
                  </SvgIcon>
                </InputAdornment>
              )
            }}
            onChange={handleQueryChange}
            placeholder="Search"
            value={query}
            variant="outlined"
          />
          <Box flexGrow={1}/>
          <TextField
            label="Sort By"
            name="sort"
            onChange={handleSortChange}
            select
            SelectProps={{native: true}}
            value={sort}
            variant="outlined"
          >
            {sortOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </TextField>
        </Box>
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAll}
              indeterminate={selectedSome}
              onChange={handleSelectAll}
            />
            <Button
              variant="outlined"
              className={classes.bulkAction} onClick={() => handleDelete(selectedGraphs)}>
              Delete
            </Button>
          </div>
        </div>
      )}
      <PerfectScrollbar>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  URI
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedList.map((g) => {
                const isSelected = selectedGraphs.includes(g.value);
                return (
                  <TableRow
                    hover
                    key={g.value}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => handleSelectOne(event, g.value)}
                        value={isSelected}
                      />
                    </TableCell>
                    <TableCell>
                      {g.value}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleDelete([g.value])}>
                        <SvgIcon fontSize="small">
                          <TrashIcon/>
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredList.length}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </PerfectScrollbar>
      <OkCancelDialog open={deleteDialogOpen}
                      onClose={() => setDeleteDialogOpen(false)}
                      message="Are you sure you want to delete selected graphs?"
                      onOk={handleDeleteConfirm}/>
    </Card>
  );
}

Results.propTypes = {
  className: PropTypes.string,
  products: PropTypes.array
};

Results.defaultProps = {
  products: []
};

export default Results;
