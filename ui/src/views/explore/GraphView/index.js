import React, {useState} from 'react';
import {
  Box, Grid, Collapse,
  Container,
  makeStyles, Typography
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import NodeSearch from "../../../components/NodeSearch";
import Graph from "./Graph";
import {useSelector} from "react-redux";
import NodeDetailsPanel from "./NodeDetailsPanel";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  container: {
    height: "75vh"
  },
  graphBox: {
    width: "100%",
    height: "100%"
  }
}));


function GraphView() {
  const classes = useStyles();
  const {projectId} = useSelector(state => state.projectReducer);
  const {nodeDetailsPanelOpen} = useSelector(state => state.visualGraphReducer);

  return (
    <Page
      className={classes.root}
      title="Dashboard">
      <Container
        className={classes.container}
        maxWidth={false}>
        <Header/>
        {projectId ?
          <>
            <Box mt={3}>
              <NodeSearch/>
            </Box>
            <Box mt={3} className={classes.graphBox}>
              <Grid container className={classes.graphBox}>
                <Grid item md={nodeDetailsPanelOpen ? 10 : 12}>
                  <Graph/>
                </Grid>
                <Grid item>
                  <Collapse in={nodeDetailsPanelOpen} timeout="auto" unmountOnExit>
                    <NodeDetailsPanel/>
                  </Collapse>
                </Grid>
              </Grid>
            </Box>
          </> : <Box mt={3}>
            <Typography variant="h5"
                        color="textSecondary"> Please select a project
            </Typography>
          </Box>
        }
      </Container>
    </Page>
  );
}

export default GraphView;
