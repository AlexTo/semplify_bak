import {Box, Container, makeStyles, Typography} from "@material-ui/core";
import Page from "../../../components/Page";
import Header from "./Header";
import React from "react";
import Results from "./Results";
import {useSelector} from "react-redux";

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
  const {projectId} = useSelector(state => state.projectReducer);
  return (
    <Page
      className={classes.root}
      title="Graphs"
    >
      <Container maxWidth={false}>
        <Header/>
        <Box mt={3}>
          {projectId ? <Results/> : <Typography variant="h5"
                                                color="textSecondary"> Please select a project </Typography>}
        </Box>
      </Container>
    </Page>
  );
}

export default GraphListView;
