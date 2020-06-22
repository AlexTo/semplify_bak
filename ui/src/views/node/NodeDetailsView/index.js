import React, {useEffect, useState} from "react";
import {Divider, Container, Box, makeStyles, Tab, Tabs, Typography} from "@material-ui/core";
import Page from "../../../components/Page";
import {useLazyQuery} from "@apollo/react-hooks";
import {entityHubQueries} from "../../../graphql";
import Header from "./Header";
import NodeProperties from "./NodeProperties";
import NodeRelations from "./NodeRelations";
import {useDispatch} from "react-redux";
import {nodeDetailsActions} from "../../../actions/nodeDetailsActions";

const useStyles = makeStyles(() => ({
  root: {},
  tab: {
    textTransform: "none",
  }
}))

function NodeDetailsView({location}) {
  const classes = useStyles();
  const [node, setNode] = useState(null);
  const [tab, setTab] = useState("properties");
  const dispatch = useDispatch();
  const {search} = location;
  const params = new URLSearchParams(search);
  const uri = params.get('uri');
  const projectId = params.get('projectId');

  const [load] = useLazyQuery(entityHubQueries.node, {
    onCompleted: data => {
      setNode(data.node)
    }
  });

  useEffect(() => {
    if (!uri || !projectId)
      return;

    dispatch(nodeDetailsActions.setNode(projectId, uri));

    load({
      variables: {
        projectId, uri
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri, projectId])

  const handleTabsChange = (event, value) => {
    setTab(value);
  }

  if (!uri || !projectId || !node) return null;

  return (
    <Page
      className={classes.root}
      title={uri}>
      <Container maxWidth={false}>
        <Header node={node}/>
        <Box mt={3}>
          <Tabs
            onChange={handleTabsChange}
            variant="scrollable"
            scrollButtons="auto"
            value={tab}>
            <Tab component="div" value="properties" label={
              <Typography className={classes.tab} color="textPrimary">
                Properties
              </Typography>
            }/>
            <Tab component="div" value="relations" label={
              <Typography className={classes.tab} color="textPrimary">
                Relations
              </Typography>
            }/>
          </Tabs>
        </Box>
        <Divider/>
        {tab === "properties" && <NodeProperties/>}
        {tab === "relations" && <NodeRelations/>}
      </Container>
    </Page>
  )
}

export default NodeDetailsView;
