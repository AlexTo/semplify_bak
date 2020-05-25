import React from 'react';
import {
  Box,
  Container,
  makeStyles, Typography
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from "./Results";
import RDFUploadDialog from "./RDFUploadDialog";
import RDFImportDialog from "./RDFImportDialog";
import {useSelector} from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100
  }
}));

function ImportView() {
  const classes = useStyles();
  const {projectId} = useSelector(state => state.projectReducer)
  return (
    <Page
      className={classes.root}
      title="Import"
    >
      <Container maxWidth={false}>
        <Header/>
        <Box mt={3}>
          {projectId ? <Results/> : <Typography variant="h5"
                                                color="textSecondary"> Please select a project </Typography>}
        </Box>
        <RDFImportDialog/>
        <RDFUploadDialog/>
      </Container>
    </Page>
  );
}

export default ImportView;
