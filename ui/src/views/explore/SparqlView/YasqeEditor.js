import React, {useEffect, useRef, useState} from "react";
import Yasqe from "@triply/yasqe";
import "@triply/yasqe/build/yasqe.min.css";
import "codemirror/theme/darcula.css";
import {useSelector} from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import {Box, Card, TableCell, Table, TableBody, TableHead, TableRow} from "@material-ui/core";

function YasqeEditor() {

  const {projectId} = useSelector(state => state.projectReducer);
  const {theme} = useSelector(state => state.yasqeReducer);
  const [yasque, setYasqe] = useState(null)

  useEffect(() => {
    setYasqe(new Yasqe(document.getElementById("yasqe"), {
      createShareableLink: false,
      showQueryButton: false,
      theme: theme
    }));
    return () => {
    };
  }, [])

  useEffect(() => {
    if (yasque) {
      yasque.setOption("theme", theme)
    }
    console.log(theme);
  }, [theme])

  return (
    <>
      <div id="yasqe"/>
      <Card>
        <PerfectScrollbar>
          <Box minWidth={1200}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Haha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Haha</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
      </Card>
    </>
  )
}

export default YasqeEditor;
