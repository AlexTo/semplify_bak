import React, {useEffect, useState} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import NodeSearch from "../../../components/NodeSearch";
import Graph from "./Graph";
import {useLazyQuery} from "@apollo/react-hooks";
import {entityHubQueries} from "../../../graphql";
import {useSnackbar} from "notistack";
import {node} from "prop-types";

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
  graphBox: {
    width: "100%",
    height: "100%"
  }
}));


function GraphView() {
  const classes = useStyles();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [graphData, setGraphData] = useState([])
  const {enqueueSnackbar} = useSnackbar();

  const createGraphNode = (node) => {
    return {
      data: {
        id: node.value,
        projectId: node.projectId,
        graph: node.graph,
        label: node.prefLabel.value.length > 15
          ? `${node.prefLabel.value.substring(0, 15)}...` : node.prefLabel.value
      },
      classes: 'center-center'
    }
  }

  const createGraphEdge = (pred) => {
    return {
      data: {
        projectId: pred.projectId,
        graph: pred.graph,
        label: pred.prefLabel.value,
        source: pred.from.value,
        target: pred.to.value
      },
      classes: 'autorotate'
    }
  }

  const [loadPredicatesFromNode] = useLazyQuery(
    entityHubQueries.predicatesFromNode, {
      onCompleted: data => {
        const {predicatesFromNode} = data;
        const predicatesToIRI = predicatesFromNode.filter(p => p.to.__typename === 'IRI');
        if (predicatesToIRI.length === 0) {
          enqueueSnackbar('This node has no other connections', {
            variant: 'success'
          });
          return;
        }

        const existingNodes = nodes.map(n => n.data.id)
        const addedNodes = predicatesToIRI
          .filter(p => !existingNodes.includes(p.to.value))
          .map(p => {
            const {to} = p
            return createGraphNode(to);
          })
        const addedEdges = predicatesToIRI
          .filter(p => !edges.find(e => e.data.source === p.from.value && e.data.target === p.to.value))
          .map(p => createGraphEdge(p))
        if (addedNodes.length > 0 || addedEdges.length > 0) {
          const newNodes = [...addedNodes, ...nodes];
          setNodes(newNodes);
          const newEdges = [...addedEdges, ...edges];
          setEdges(newEdges);
          setGraphData([...newNodes, ...newEdges])
        }
      },
      fetchPolicy: 'no-cache'
    });

  const handleNodeSelected = (value) => {
    if (!value) {
      return;
    }

    const {node} = value;
    const newNode = createGraphNode(node);
    const newNodes = [newNode, ...nodes];
    setNodes(newNodes);
    setGraphData([...newNodes, ...edges])
  }

  const handleNodeExpanded = (node) => {
    loadPredicatesFromNode({
      variables: {
        projectId: node.projectId,
        uri: node.id
      }
    })
  }

  const handleNodeRemoved = (id) => {
    console.log(id);
    console.log(nodes);
    const newNodes = nodes.filter(n => n.data.id !== id);
    const newEdges = edges.filter(e => e.data.source !== id && e.data.target !== id);
    setNodes(newNodes);
    setEdges(newEdges);
    setGraphData([...newNodes, ...newEdges]);
  }

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
        <Box mt={3}>
          <NodeSearch onOptionSelected={handleNodeSelected}/>
        </Box>
        <Box mt={3} className={classes.graphBox}>
          <Graph graphData={graphData} onNodeExpanded={handleNodeExpanded} onNodeRemoved={handleNodeRemoved}/>
        </Box>
      </Container>
    </Page>
  );
}

export default GraphView;
