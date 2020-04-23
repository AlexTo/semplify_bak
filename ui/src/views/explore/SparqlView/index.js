import React from "react";
import Page from "../../../components/Page";
import {Box, Container, makeStyles} from "@material-ui/core";
import Header from "./Header";
import YasqeEditor from "./YasqeEditor";


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  container: {
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 64,
      paddingRight: 64
    },
    height: "75vh"
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
      <Container
        className={classes.container}
        maxWidth={false}
      >
        <Header/>
        <Box mt={3} className={classes.editorBox}>
          <YasqeEditor/>
        </Box>
      </Container>
    </Page>
  );
}

export default SparqlView;
