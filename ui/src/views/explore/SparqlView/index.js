import React from "react";
import Page from "../../../components/Page";
import {Box, Container, makeStyles} from "@material-ui/core";
import Header from "./Header";
import YasqeManager from "./YasqeManager";


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  editorBox: {
    width: "100%",
    height: "100%"
  }
}));

function SparqlView() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Header/>
        <Box mt={3} className={classes.editorBox}>
          <YasqeManager/>
        </Box>
      </Container>
    </Page>
  );
}

export default SparqlView;
