import React from 'react';
import {makeStyles} from '@material-ui/styles';
import {Container} from '@material-ui/core';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function Overview() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Overviewww">
      <Container maxWidth="lg">
        Overviewwwwwwwwwwwwwwwwwwwwwwwww
      </Container>
    </Page>
  );
}

export default Overview;
