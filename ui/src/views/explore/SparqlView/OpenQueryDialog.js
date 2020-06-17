/* eslint-disable max-len */
import React, {useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
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
  Link,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  makeStyles, DialogTitle, Typography, DialogContent, Dialog
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Search as SearchIcon
} from 'react-feather';
import DraggableDialogPaperComponent from "../../../components/DraggableDialogPaperComponent";
import {useDispatch, useSelector} from "react-redux";
import {sparqlActions} from "../../../actions/sparqlActions";

function applyFilters(products, query) {
  return products.filter((product) => {
    let matches = true;

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
  const [queries, setQueries] = useState([]);
  const {openQueryDialogOpen} = useSelector(state => state.sparqlReducer);
  const [selectedQueries, setSelectedQueries] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleQueryChange = (event) => {
    event.persist();
    setSearchTerm(event.target.value);
  };

  const handleSelectAll = (event) => {
    setSelectedQueries(event.target.checked
      ? queries.map((q) => q.id)
      : []);
  };

  const handleSelectOne = (event, id) => {
    if (!selectedQueries.includes(id)) {
      setSelectedQueries((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedQueries((prevSelected) => prevSelected.filter((id) => id !== id));
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

  const filteredQueries = applyFilters(queries, searchTerm);
  const paginatedQueries = applyPagination(filteredQueries, page, limit);
  const enableBulkOperations = selectedQueries.length > 0;
  const selectedSome = selectedQueries.length > 0 && selectedQueries.length < queries.length;
  const selectedAll = selectedQueries.length > 0 && selectedQueries.length === queries.length;

  return (
    <Dialog open={openQueryDialogOpen}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md" fullWidth
            PaperComponent={DraggableDialogPaperComponent}>
      <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
        <Typography className={classes.title}>
        </Typography>
      </DialogTitle>
      <DialogContent>
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
                <TableCell/>
                <TableCell>
                  Title
                </TableCell>
                <TableCell>
                  Description
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedQueries.map((q) => {
                const isSelected = selectedQueries.includes(q.id);
                return (
                  <TableRow
                    hover
                    key={q.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => handleSelectOne(event, q.id)}
                        value={isSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        variant="subtitle2"
                        color="textPrimary"
                        component={RouterLink}
                        underline="none"
                        to="#"
                      >
                        {q.title}
                      </Link>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton>
                        <SvgIcon fontSize="small">
                          <EditIcon/>
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
      </DialogContent>
    </Dialog>
  );
}

export default OpenQueryDialog;
