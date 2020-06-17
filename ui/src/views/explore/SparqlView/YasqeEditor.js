import React, {useEffect, useState} from "react";
import Yasqe from "@triply/yasqe";
import "@triply/yasqe/build/yasqe.min.css";
import "codemirror/theme/darcula.css";
import {useDispatch, useSelector} from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  TableCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TablePagination, Typography
} from "@material-ui/core";
import {useKeycloak} from "@react-keycloak/web";
import {sparqlActions} from "../../../actions/sparqlActions";
import {Alert} from "@material-ui/lab";


function YasqeEditor({id}) {
  const {projectId} = useSelector(state => state.projectReducer);
  const [duration, setDuration] = useState(-1);
  const dispatch = useDispatch();
  const [keycloak] = useKeycloak();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const {theme} = useSelector(state => state.yasqeReducer);
  const [yasqe, setYasqe] = useState(null)
  const {executeTab, queryResults} = useSelector(state => state.sparqlReducer);
  const [error, setError] = useState(null);

  useEffect(() => {
    const yasqe = new Yasqe(document.getElementById("yasqe"), {
      createShareableLink: false,
      showQueryButton: false,
      theme: theme,
      persistenceId: `yasqe_${id}`
    });

    yasqe.on("queryResults", (instance, results) => {
      setError(null);
      dispatch(sparqlActions.queryFinished(id, results));
    });

    yasqe.on("queryResponse", (instance, req, duration) => {
      setDuration(duration);
    });

    setYasqe(yasqe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!yasqe || executeTab !== id) {
      return;
    }
    yasqe.query({
      reqMethod: "POST",
      endpoint: `/api/sparql?projectId=${projectId}`,
      headers: {
        Authorization: `Bearer ${keycloak.token}`
      },
    }).catch(e => {
      setError(e.response.body.error.exception.description);
    });
    dispatch(sparqlActions.tabExecuting(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executeTab])

  useEffect(() => {
    if (yasqe) {
      yasqe.setOption("theme", theme)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])


  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  return (
    <>
      <div id="yasqe"/>
      {error && <Alert severity="error">{error}</Alert>}
      {!error && queryResults[id] && <PerfectScrollbar>
        <Box px={2}>
          {duration > 0 && <Typography
            variant="h6"
            color="textSecondary">
            Elapsed: {duration} ms.
          </Typography>}
        </Box>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                {queryResults[id].head.vars.map((v, idx) => <TableCell key={idx}>{v}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {queryResults[id].results.bindings.slice(page * limit, page * limit + limit).map((binding, idx) =>
                <TableRow key={idx}>
                  {queryResults[id].head.vars.map((v, idx) => <TableCell
                    key={idx}>{binding[v] && binding[v]["value"]}</TableCell>)}
                </TableRow>)}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={queryResults[id].results.bindings.length}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </PerfectScrollbar>}
    </>
  )
}

export default YasqeEditor;
