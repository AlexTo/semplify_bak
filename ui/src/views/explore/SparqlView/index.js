import React from "react";
import Page from "../../../components/Page";
import {Box, Container, makeStyles, Typography} from "@material-ui/core";
import Header from "./Header";
import YasqeManager from "./YasqeManager";
import {useSelector} from "react-redux";


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
  const {projectId} = useSelector(state => state.projectReducer);
  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Header/>
        <Box mt={3} className={classes.editorBox}>
          {projectId ? <YasqeManager/> : <Typography variant="h5"
                                                     color="textSecondary"> Please select a project </Typography>}
        </Box>
      </Container>
    </Page>
  );
}

export default SparqlView;
