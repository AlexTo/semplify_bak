export const VISUAL_GRAPH_NODE_ADDED = 'VISUAL_GRAPH_NODE_ADDED';
export const VISUAL_GRAPH_EDGES_ADDED = 'VISUAL_GRAPH_EDGES_ADDED';
export const VISUAL_GRAPH_NODE_REMOVED = 'VISUAL_GRAPH_NODE_REMOVED';

export const visualGraphActions = {
  addNode,
  removeNode,
  addEdges
}

function removeNode(uri) {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_NODE_REMOVED,
    uri
  })
}

function addNode(node) {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_NODE_ADDED,
    node
  })
}

function addEdges(edges) {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_EDGES_ADDED,
    edges
  })
}

