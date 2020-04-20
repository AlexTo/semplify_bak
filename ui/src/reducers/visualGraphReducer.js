import {createGraphEdge, createGraphNode} from '../utils/graph';
import {
  VISUAL_GRAPH_EDGES_ADDED,
  VISUAL_GRAPH_NODE_ADDED,
  VISUAL_GRAPH_NODE_REMOVED
} from "../actions/visualGraphActions";

const initialState = {
  nodes: [],
  edges: [],
}

export const visualGraphReducer = (state = initialState, action) => {

  const {nodes, edges} = state;

  switch (action.type) {
    case VISUAL_GRAPH_NODE_ADDED:
      const newNode = createGraphNode(action.node);
      const newNodes = [newNode, ...nodes];
      return Object.assign({}, state, {nodes: newNodes});

    case VISUAL_GRAPH_EDGES_ADDED:
      const existingNodes = nodes.map(n => n.data.id)
      const addedNodes = action.edges
        .filter(p => !existingNodes.includes(p.to.value))
        .map(p => {
          const {to} = p
          return createGraphNode(to);
        })
      const addedEdges = action.edges
        .filter(p => !edges.find(e => e.data.source === p.from.value && e.data.target === p.to.value))
        .map(p => createGraphEdge(p))

      if (addedNodes.length > 0 || addedEdges.length > 0) {
        return Object.assign({}, state, {
          nodes: [...addedNodes, ...nodes], edges: [...addedEdges, ...edges]
        })
      } else {
        return state;
      }

    case VISUAL_GRAPH_NODE_REMOVED:

      const remainingEdges = edges.filter(e => e.data.source !== action.uri && e.data.target !== action.uri);

      const remainingNodes = nodes
        .filter(n => n.data.id !== action.uri)
        .filter(n => remainingEdges.find(e => e.data.source === n.data.id || e.data.target === n.data.id))

      return Object.assign({}, state, {nodes: [...remainingNodes], edges: [...remainingEdges]});

    default:
      return state
  }
}


