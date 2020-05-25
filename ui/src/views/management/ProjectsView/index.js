import React from "react";
import {Box, Container, makeStyles} from "@material-ui/core";
import Page from "../../../components/Page";
import Header from "./Header";
import Results from "./Results";
import NewProjectDialog from "./NewProjectDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100
  }
}));

function ProjectsView() {
  const classes = useStyles();
  return (
    <Page
      className={classes.root}
      title="Projects"
    >
      <Container maxWidth={false}>
        <Header/>
        <Box mt={3}>
          <Results/>
        </Box>
        <NewProjectDialog/>
      </Container>
    </Page>
  )
}

export default ProjectsView;
