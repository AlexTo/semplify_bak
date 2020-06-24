import React, {useEffect, useState} from "react";
import {
  Box,
  Grid,
  Popover,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Tooltip,
  makeStyles,
  IconButton, TablePagination
} from "@material-ui/core";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {entityHubQueries} from "../../../graphql";
import {useSelector} from "react-redux";
import clsx from 'clsx';
import {Edit as EditIcon, Delete as DeleteIcon} from "@material-ui/icons";
import Value from "./Value";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import {useSnackbar} from "notistack";
import _ from 'lodash';
import TripleEditor from "./TripleEditor";

function applyPagination(triples, page, limit) {
  return triples.slice(page * limit, page * limit + limit);
}

const useStyles = makeStyles((theme) => ({
  root: {},
  predCell: {
    fontWeight: theme.typography.fontWeightMedium,
    width: 300
  },
  tableCell: {
    borderBottom: "none"
  },
  actionIcon: {
    marginRight: theme.spacing(1)
  },
  objValue: {
    "& .hidden-button": {
      visibility: "hidden"
    },
    "&:hover .hidden-button": {
      visibility: "visible"
    }
  }
}));

function NodeProperties() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [triples, setTriples] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectedTriple, setSelectedTriple] = useState(null);
  const {node} = useSelector(state => state.nodeDetailsReducer);
  const {enqueueSnackbar} = useSnackbar();
  const [deleteTriple] = useMutation(entityHubQueries.deleteTriple)

  const {data, refetch} = useQuery(entityHubQueries.triplesFromNode, {
    variables: {
      projectId: node.projectId,
      subj: node.value,
      nodeType: 'literal'
    },
    skip: !node
  });

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handleDelete = (triple) => {
    setSelectedTriple(triple);
    setDeleteDialogOpen(true);
  }

  const handleDeleteConfirm = () => {
    const {subj, pred, obj} = selectedTriple;
    deleteTriple({
      variables: {
        projectId: obj.projectId,
        graph: obj.graph,
        subj: subj.value,
        pred: pred.value,
        objType: "literal",
        objValue: obj.value,
        lang: obj.lang,
        dataType: obj.dataType
      }
    }).then(() => {
      setDeleteDialogOpen(false);
      refetch().then(() => {
        enqueueSnackbar("Property deleted", {
          variant: "success"
        });
      })
    })
  }

  const handleEdit = (e, key) => {
    setAnchorEl(Object.assign({}, anchorEl, {[key]: e.currentTarget}));
  }

  useEffect(() => {
    if (!data || !data.triplesFromNode || !data.triplesFromNode.triples) {
      return;
    }
    setTriples(data.triplesFromNode.triples);
  }, [data])

  const paginatedTriples = applyPagination(triples, page, limit);

  return (
    <Box
      py={2}
      alignItems="center"
      className={classes.root}>
      <Table>
        <TableBody>
          {paginatedTriples.map((t, key) => {
            return (
              <TableRow key={key}>
                <TableCell className={clsx(classes.predCell, classes.tableCell)}>
                  <Tooltip title={t.pred.value} placement="bottom-start">
                    <Typography
                      variant="h6"
                      color="textSecondary">
                      {t.pred.prefLabel.value}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    className={classes.objValue}>
                    <Value obj={t.obj}/>
                    <IconButton color="primary" size="small" className="hidden-button"
                                onClick={(e) => handleEdit(e, key)}>
                      <EditIcon fontSize="small"/>
                    </IconButton>
                    <IconButton color="primary" size="small" className="hidden-button" onClick={() => handleDelete(t)}>
                      <DeleteIcon fontSize="small"/>
                    </IconButton>
                  </Typography>
                </TableCell>
                <Popover
                  open={anchorEl && Boolean(anchorEl[key])}
                  anchorEl={anchorEl[key]}
                  onClose={() => setAnchorEl(_.omit(anchorEl, [key]))}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}>
                  <TripleEditor triple={t} onSave={() => {
                    refetch().then(() => setAnchorEl(_.omit(anchorEl, [key])));
                  }}/>
                </Popover>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={triples.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}/>
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onOk={handleDeleteConfirm}
        message={
          <>
            <Box>
              <Typography
                variant="h6"
                color="textPrimary">
                Are you sure you want to delete the following property ?
              </Typography>
            </Box>
            {selectedTriple && <>
              <Box mt={3}>
                <Grid container>
                  <Grid item md={6}>
                    <Typography
                      variant="h6"
                      color="textPrimary">
                      {selectedTriple.pred.value}
                    </Typography>
                  </Grid>
                  <Grid item md={6}>
                    <Typography
                      variant="h6"
                      color="textPrimary">
                      <Value obj={selectedTriple.obj}/>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </>
            }
          </>}/>
    </Box>
  )
}

export default NodeProperties;
