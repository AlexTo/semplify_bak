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
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Trash as TrashIcon,
} from 'react-feather';
import {useQuery} from "@apollo/react-hooks";
import {projectQueries} from "../../../graphql";
import OkCancelDialog from "../../../components/ConfirmationDialog";
import moment from "moment";

function applyFilters(webPages) {
  return webPages.filter(() => {
    return true;
  });
}

function applyPagination(webPages, page, limit) {
  return webPages.slice(page * limit, page * limit + limit);
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

  const [selectedProjects, setSelectedProjects] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [projects, setProjects] = useState([]);
  const {data} = useQuery(projectQueries.projects);

  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [filters,] = useState({
    category: null,
    availability: null,
    inStock: null,
    isShippable: null
  });

  useEffect(() => {
    if (!data) {
      setProjects([])
      return;
    }
    setProjects(data.projects);
  }, [data])

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAll = (event) => {
    setSelectedProjects(event.target.checked
      ? projects.map((p) => p.id)
      : []);
  };

  const handleSelectOne = (event, pageId) => {
    if (!selectedProjects.includes(pageId)) {
      setSelectedProjects((prevSelected) => [...prevSelected, pageId]);
    } else {
      setSelectedProjects((prevSelected) => prevSelected.filter((id) => id !== pageId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };


  const handleDelete = (files) => {
    setSelectedProjects(files);
    setDeleteDialogOpen(true);
  }

  const handleDeleteConfirm = () => {
  }

  const filteredList = applyFilters(projects, query, filters);
  const paginatedList = applyPagination(filteredList, page, limit);
  const enableBulkOperations = selectedProjects.length > 0;
  const selectedSome = selectedProjects.length > 0 && selectedProjects.length < projects.length;
  const selectedAll = selectedProjects.length > 0 && selectedProjects.length === projects.length;

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
                    color="action"
                  >
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
              className={classes.bulkAction} onClick={() => handleDelete(selectedProjects)}>
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
                  Name
                </TableCell>
                <TableCell>
                  Repository
                </TableCell>
                <TableCell>
                  Created by
                </TableCell>
                <TableCell>
                  Created
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedList.map(p => {
                const isSelected = selectedProjects.includes(p.id);
                return (
                  <TableRow
                    hover
                    key={p.id}
                    selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => handleSelectOne(event, p.id)}
                        value={isSelected}/>
                    </TableCell>
                    <TableCell>
                      {p.title}
                    </TableCell>
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center">
                        <Box ml={2}>
                          {p.repository.type}
                          <Typography
                            variant="body2"
                            color="textSecondary">
                            {p.repository.hostList}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {p.createdBy}
                    </TableCell>
                    <TableCell>
                      {moment(p.created).fromNow()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleDelete([p.id])}>
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
                      message="Are you sure you want to delete selected projects?"
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
