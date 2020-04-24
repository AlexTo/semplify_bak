import React, {useEffect, useRef, useState} from "react";
import Yasqe from "@triply/yasqe";
import "@triply/yasqe/build/yasqe.min.css";
import "codemirror/theme/darcula.css";
import {useSelector} from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Button,
  TableCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Divider,
  makeStyles, TablePagination
} from "@material-ui/core";
import {Play as PlayIcon} from "react-feather";
import {useKeycloak} from "@react-keycloak/web";

const useStyles = makeStyles((theme) => ({
  root: {},
  actionIcon: {
    marginRight: theme.spacing(1)
  }
}));

function YasqeEditor({id}) {
  const classes = useStyles();
  const {projectId} = useSelector(state => state.projectReducer);
  const [results, setResults] = useState({
    head: {vars: []},
    results: {bindings: []}
  })
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const {theme} = useSelector(state => state.yasqeReducer);
  const [yasqe, setYasqe] = useState(null)
  const [keycloak] = useKeycloak()

  useEffect(() => {
    const yasqe = new Yasqe(document.getElementById("yasqe"), {
      requestConfig: {
        endpoint: `/api/sparql?projectId=${projectId}`
      },
      createShareableLink: false,
      showQueryButton: false,
      theme: theme,
      persistenceId: `yasqe_${id}`
    });

    yasqe.on("queryResults", (instance, results) => {
      setResults(results);
    })

    setYasqe(yasqe);
    return () => {
    };
  }, [])

  useEffect(() => {
    if (yasqe) {
      yasqe.setOption("theme", theme)
    }
  }, [theme])


  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const execute = () => {
    yasqe.query({
      reqMethod: "POST",
      headers: {
        Authorization: `Bearer ${keycloak.token}`
      },
      args: {projectId: projectId}
    });
  }

  return (
    <>
      <div id="yasqe"/>
      <Box p={1}>
        <Button variant="contained" color="primary" onClick={execute}>
          <PlayIcon/>
        </Button>
      </Box>
      <Divider/>
      <PerfectScrollbar>
        <Box minWidth={1200}>
          <Table>
            <TableHead>
              <TableRow>
                {results.head.vars.map((v, idx) => <TableCell key={idx}>{v}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {results.results.bindings.slice(page * limit, page * limit + limit).map((binding, idx) =>
                <TableRow key={idx}>
                  {results.head.vars.map((v, idx) => <TableCell key={idx}>{binding[v]["value"]}</TableCell>)}
                </TableRow>)}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={results.results.bindings.length}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </PerfectScrollbar>
    </>
  )
}

export default YasqeEditor;
