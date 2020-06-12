import React, {useEffect, useState} from "react";
import {
  Avatar, Link, Dialog, DialogContent, DialogTitle, Table, Button,
  TableHead, TableRow, TableCell, TableBody,
  TextField, InputAdornment, Box, SvgIcon, IconButton,
  Checkbox, TablePagination, Typography, makeStyles
} from "@material-ui/core";
import DraggableDialogPaperComponent from "../../../components/DraggableDialogPaperComponent";
import {useDispatch, useSelector} from "react-redux";
import {visualGraphActions} from "../../../actions";
import {useLazyQuery} from "@apollo/react-hooks";
import {entityHubQueries} from "../../../graphql";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  ArrowRight as ArrowRightIcon,
  Search as SearchIcon
} from 'react-feather';
import getInitials from 'src/utils/getInitials';

const useStyles = makeStyles((theme) => ({
  link: {},
  title: {
    '& > * + *': {
      marginLeft: theme.spacing(1),
    },
  },
  queryField: {
    width: 500
  },
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
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  }
}));

const sortOptions = [
  {
    value: 'prefLabel.value|asc',
    label: 'Label (asc)'
  },
  {
    value: 'prefLabel.value|desc',
    label: 'Label (desc)'
  },
  {
    value: 'value|asc',
    label: 'URI (asc)'
  },
  {
    value: 'value|desc',
    label: 'URI (desc)'
  }
];

function applyFilters(objs, query) {
  return objs.filter((obj) => {
    let matches = true;

    if (query) {
      const properties = ['prefLabel.value', 'value'];
      let containsQuery = false;

      properties.forEach((property) => {

        let i;
        const path = property.split('.');
        for (i = 0; i < path.length - 1; i++)
          obj = obj[path[i]];

        const value = obj[path[i]];

        if (value.toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });
}

function applyPagination(objs, page, limit) {
  return objs.slice(page * limit, page * limit + limit);
}

function descendingComparator(a, b, orderBy) {
  let i;
  const path = orderBy.split('.');
  for (i = 0; i < path.length - 1; i++) {
    a = a[path[i]];
    b = b[path[i]];
  }

  const valueA = a[path[i]];
  const valueB = b[path[i]];

  if (valueB < valueA) {
    return -1;
  }

  if (valueB > valueA) {
    return 1;
  }

  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySort(objs, sort) {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = objs.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    // eslint-disable-next-line no-shadow
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

function CompoundNodeExpansionDialog() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [subj, setSubj] = useState(null);
  const [pred, setPred] = useState(null);
  const [objs, setObjs] = useState([])
  const [selectedObjs, setSelectedObjs] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);

  const {
    nodes, edges,
    compoundNodeExpansionDialogOpen,
    selectedCompoundNode
  } = useSelector(state => state.visualGraphReducer);

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    event.persist();
    setSort(event.target.value);
  };

  const handleSelectAll = (event) => {
    setSelectedObjs(event.target.checked
      ? objs : []);
  };

  const handleSelectOne = (event, obj) => {
    if (!selectedObjs.includes(obj)) {
      setSelectedObjs((prevSelected) => [...prevSelected, obj]);
    } else {
      setSelectedObjs((prevSelected) => prevSelected.filter((i) => i !== obj));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const filteredObjs = applyFilters(objs, query);
  const sortedObjs = applySort(filteredObjs, sort);
  const paginatedObjs = applyPagination(sortedObjs, page, limit);
  const enableBulkOperations = selectedObjs.length > 0;
  const selectedSome = selectedObjs.length > 0 && selectedObjs.length < objs.length;
  const selectedAll = selectedObjs.length === objs.length;

  const [loadObjsFromNode] = useLazyQuery(
    entityHubQueries.objsFromNode, {
      onCompleted: (data) => {
        const {triplesFromNode} = data;
        setObjs(triplesFromNode.map(t => t.obj));
      },
      fetchPolicy: 'no-cache'
    }
  );

  useEffect(() => {
    if (!compoundNodeExpansionDialogOpen) {
      setPage(0);
      setSelectedObjs([])
    }

  }, [compoundNodeExpansionDialogOpen]);

  useEffect(() => {
    if (!subj || !pred)
      return;
    loadObjsFromNode({
      variables: {
        projectId: subj.projectId,
        subj: subj.id,
        pred: pred.value,
        nodeType: 'iri'
      }
    })

  }, [subj, pred]);

  useEffect(() => {
    if (!selectedCompoundNode)
      return;
    const data = selectedCompoundNode.data();
    const subj = nodes.find(n => n.data.id === data.subj);
    const pred = edges.find(e => e.data.source === subj.data.id && e.data.target === data.id);
    setSubj(subj.data);
    setPred(pred.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompoundNode])

  const handleAddToGraph = (selectedObjs) => {
    const triples = selectedObjs.map(o => {
      return {
        subj: {
          value: subj.id
        },
        pred: {
          value: pred.value
        },
        obj: o
      }
    });
    dispatch(visualGraphActions.addTriples(triples));
  }

  const handleClose = () => {
    dispatch(visualGraphActions.closeCompoundNodeExpansionDialog());
  }

  if (!selectedCompoundNode) return null;

  return (
    <Dialog open={compoundNodeExpansionDialogOpen}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md" fullWidth
            PaperComponent={DraggableDialogPaperComponent}>
      <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
        <Typography className={classes.title}>
          {subj && <Link className={classes.link} href={subj.id} target="_blank" rel="noreferrer">
            {subj.label}
          </Link>} >
          {pred && <Link className={classes.link} href={pred.value} target="_blank" rel="noreferrer">
            {pred.label}
          </Link>}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          minHeight={56}
          display="flex"
          alignItems="center">
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
                onClick={() => handleAddToGraph(selectedObjs)}
              >
                Add to Graph
              </Button>
            </div>
          </div>
        )}
        <PerfectScrollbar>
          <Box minWidth={700}>
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
                  </TableCell>
                  <TableCell align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedObjs.map((obj) => {
                  const isSelected = selectedObjs.includes(obj);
                  return (
                    <TableRow
                      hover
                      key={obj.value}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => handleSelectOne(event, obj)}
                          value={isSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          display="flex"
                          alignItems="center"
                        >
                          {obj.depiction && <Avatar
                            className={classes.avatar}
                            src={obj.depiction.uri}/>}
                          {!obj.depiction && <Avatar
                            className={classes.avatar}
                          >
                            {getInitials(obj.prefLabel.value)}
                          </Avatar>}
                          <div>
                            <Typography
                              color="inherit"
                              variant="h6">
                              {obj.prefLabel.value}
                            </Typography>
                            <Link
                              variant="body2"
                              color="textSecondary"
                              href={obj.value} target="_blank" rel="noreferrer">
                              {obj.value}
                            </Link>
                          </div>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleAddToGraph([obj])}>
                          <SvgIcon fontSize="small">
                            <ArrowRightIcon/>
                          </SvgIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={filteredObjs.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CompoundNodeExpansionDialog;
