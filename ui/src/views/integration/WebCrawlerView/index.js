import React from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import Results from './Results';
import CrawlDialog from "./CrawlDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100
  }
}));

function WebCrawlerView() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Web Crawler"
    >
      <Container maxWidth={false}>
        <Header/>
        <Box mt={3}>
          <Results/>
        </Box>
        <CrawlDialog/>
      </Container>
    </Page>
  );
}

export default WebCrawlerView;
