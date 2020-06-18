/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
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
  makeStyles, DialogTitle, Typography, DialogContent, Dialog, DialogActions
} from '@material-ui/core';
import {
  Folder as FolderIcon,
  Search as SearchIcon
} from 'react-feather';
import DraggableDialogPaperComponent from "../../../components/DraggableDialogPaperComponent";
import {useDispatch, useSelector} from "react-redux";
import {sparqlActions} from "../../../actions/sparqlActions";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {sparqlQueries} from "../../../graphql";
import OkCancelDialog from "../../../components/ConfirmationDialog";

function applyFilters(queries, searchTerm) {
  const s = searchTerm.trim().toLowerCase();
  return queries.filter((q) => {
    let matches = false;
    if ((q.title && q.title.toLowerCase().includes(s))
      || (q.description && q.description.toLowerCase().includes(s))) {
      matches = true;
    }
    return matches;
  });
}

function applyPagination(customers, page, limit) {
  return customers.slice(page * limit, page * limit + limit);
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
}));

function OpenQueryDialog() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {projectId} = useSelector(state => state.projectReducer);
  const [queries, setQueries] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {openQueryDialogOpen} = useSelector(state => state.sparqlReducer);
  const [selectedQueries, setSelectedQueries] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const {data, refetch} = useQuery(sparqlQueries.queries, {
    variables: {
      projectId
    }
  });
  const [deleteQueries] = useMutation(sparqlQueries.deleteQueries);

  useEffect(() => {
    if (!data) {
      setQueries([])
      return;
    }
    setQueries(data.sparqlQueries);
  }, [data])

  useEffect(() => {
    if (!openQueryDialogOpen) {
      return;
    }
    refetch().then(() => {
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openQueryDialogOpen])

  const handleQueryChange = (event) => {
    event.persist();
    setSearchTerm(event.target.value);
  };

  const handleSelectAll = (event) => {
    setSelectedQueries(event.target.checked
      ? [...queries]
      : []);
  };

  const handleSelectOne = (event, query) => {
    if (!selectedQueries.includes(query)) {
      setSelectedQueries((prevSelected) => [...prevSelected, query]);
    } else {
      setSelectedQueries((prevSelected) => prevSelected.filter((q) => q !== query));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handleClose = () => {
    dispatch(sparqlActions.closeOpenQueryDialog());
  }

  const handleOpen = (queries) => {
    dispatch(sparqlActions.openQueries(queries));
    dispatch(sparqlActions.closeOpenQueryDialog());
  }

  const handleDeleteConfirm = () => {
    deleteQueries({
      variables: {
        projectId,
        queryIds: selectedQueries.map(q => q.id)
      }
    }).then(() => {
      refetch().then(() => {
        setSelectedQueries([]);
        setDeleteDialogOpen(false);
      })
    })
  }

  const filteredQueries = applyFilters(queries, searchTerm);
  const paginatedQueries = applyPagination(filteredQueries, page, limit);
  const enableBulkOperations = selectedQueries.length > 0;
  const selectedSome = selectedQueries.length > 0 && selectedQueries.length < queries.length;
  const selectedAll = selectedQueries.length > 0 && selectedQueries.length === queries.length;

  return (
    <>
      <Dialog open={openQueryDialogOpen}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
              maxWidth="lg" fullWidth
              PaperComponent={DraggableDialogPaperComponent}>
        <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
          <Typography className={classes.title}>
          </Typography>
        </DialogTitle>
        <DialogContent>
          {queries.length === 0 && <Typography variant="h5"
                                               color="textSecondary">No queries found</Typography>}
          {queries.length > 0 &&
          <>
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
                value={searchTerm}
                variant="outlined"
              />
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
                    className={classes.bulkAction}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
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
                      Title
                    </TableCell>
                    <TableCell>
                      Description
                    </TableCell>
                    <TableCell>
                      Created by
                    </TableCell>
                    <TableCell>
                      Modified by
                    </TableCell>
                    <TableCell align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedQueries.map((q) => {
                    const isSelected = selectedQueries.includes(q);
                    return (
                      <TableRow
                        hover
                        key={q.id}
                        selected={isSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={(event) => handleSelectOne(event, q)}
                            value={isSelected}
                          />
                        </TableCell>
                        <TableCell>
                          {q.title}
                        </TableCell>
                        <TableCell>
                          {q.description}
                        </TableCell>
                        <TableCell>
                          {q.createdBy}
                        </TableCell>
                        <TableCell>
                          {q.modifiedBy}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleOpen([q])}>
                            <SvgIcon fontSize="small">
                              <FolderIcon/>
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
                count={filteredQueries.length}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Box>
          </>}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={() => handleOpen(selectedQueries)} disabled={selectedQueries.length === 0}>
            Open
          </Button>
        </DialogActions>
      </Dialog>
      <OkCancelDialog open={deleteDialogOpen}
                      onClose={() => setDeleteDialogOpen(false)}
                      message="Are you sure you want to delete the selected queries?"
                      onOk={handleDeleteConfirm}/>
    </>
  );
}

export default OpenQueryDialog;
