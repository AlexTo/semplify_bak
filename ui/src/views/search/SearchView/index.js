import React, {useEffect} from "react";
import {
  Box, Container, Backdrop,
  makeStyles, CircularProgress,
  Typography
} from "@material-ui/core";
import Page from "../../../components/Page";
import {useLazyQuery} from "@apollo/react-hooks";
import {entityHubQueries} from "../../../graphql";
import {useDispatch, useSelector} from "react-redux";
import Results from "./Results";
import {searchActions} from "../../../actions";


const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))

function SearchView({location}) {
  const classes = useStyles();
  const {search} = location;
  const dispatch = useDispatch();
  const {projectId} = useSelector(state => state.projectReducer);
  const {offset, limit} = useSelector(state => state.searchReducer);
  const params = new URLSearchParams(search);
  const q = params.get('q');
  const t = params.get('t');

  const [searchSubjs, {loading}] = useLazyQuery(entityHubQueries.searchSubjs,
    {
      onCompleted: data => dispatch(searchActions.setResults(data.searchSubjs)),
      fetchPolicy: "no-cache"
    });

  useEffect(() => {
    if (!projectId)
      return;
    searchSubjs({
      variables: {
        projectId,
        term: q,
        limit,
        offset
      }
    })
  }, [q, t, offset, limit, projectId])

  return (
    <Page
      className={classes.root}
      title="Search">
      <Container maxWidth={false}>
        <Box mt={3}>
          {projectId ? <Results/> :
            <Typography variant="h5"
                        color="textSecondary"> Please select a project </Typography>}
        </Box>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit"/>
        </Backdrop>
      </Container>
    </Page>
  )
}

export default SearchView;
