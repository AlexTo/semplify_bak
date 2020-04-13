import React from 'react';
import {
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';

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
    }
  }
}));

function GraphView() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container
        maxWidth={false}
        className={classes.container}
      >
        <Header/>
      </Container>
    </Page>
  );
}

export default GraphView;
