import React, {useEffect, useState} from "react";
import {
  Box,
  Grid,
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
import {v4 as uuidv4} from 'uuid';
import {Edit as EditIcon, Clear as ClearIcon} from "@material-ui/icons";
import Value from "./Value";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import {useSnackbar} from "notistack";

function applyFilters(graphs) {
  return graphs.filter(() => {
    return true;
  });
}

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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [triples, setTriples] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectedTriple, setSelectedTriple] = useState(null);
  const {projectId, uri} = useSelector(state => state.nodeDetailsReducer);
  const {enqueueSnackbar} = useSnackbar();
  const [deleteTriple] = useMutation(entityHubQueries.deleteTriple)

  const {data, refetch} = useQuery(entityHubQueries.triplesFromNode, {
    variables: {
      projectId,
      subj: uri,
      nodeType: 'literal'
    },
    skip: !projectId || !uri
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
        projectId,
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
          {paginatedTriples.map(t => (
            <TableRow key={uuidv4()}>
              <TableCell className={clsx(classes.predCell, classes.tableCell)}>
                <Tooltip title={t.pred.value}>
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
                  <IconButton color="primary" size="small" className="hidden-button">
                    <EditIcon fontSize="small"/>
                  </IconButton>
                  <IconButton color="primary" size="small" className="hidden-button" onClick={() => handleDelete(t)}>
                    <ClearIcon fontSize="small"/>
                  </IconButton>
                </Typography>
              </TableCell>
            </TableRow>
          ))}
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
                    <Value obj={selectedTriple.obj}/>
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
