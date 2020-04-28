import {Box, Container, makeStyles} from "@material-ui/core";
import Page from "../../../components/Page";
import Header from "./Header";
import React from "react";
import Results from "./Results";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100
  }
}));

function GraphListView() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Graphs"
    >
      <Container maxWidth={false}>
        <Header/>
        <Box mt={3}>
          <Results/>
        </Box>
      </Container>
    </Page>
  );
}

export default GraphListView;
