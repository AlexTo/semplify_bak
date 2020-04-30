import {createGraphEdge, createGraphNode} from '../utils/graph';
import {
  VISUAL_GRAPH_CLOSE_NODE_INFO_DRAWER,
  VISUAL_GRAPH_EDGES_ADDED,
  VISUAL_GRAPH_NODE_ADDED,
  VISUAL_GRAPH_NODE_REMOVED, VISUAL_GRAPH_OPEN_NODE_INFO_DRAWER
} from "../actions";

const initialState = {
  nodes: [],
  edges: [],
  nodeInfoDrawerOpen: true,
  selectedNode: null
}

export const visualGraphReducer = (state = initialState, action) => {

  switch (action.type) {
    case VISUAL_GRAPH_NODE_ADDED:
      return addNode(state, action);

    case VISUAL_GRAPH_EDGES_ADDED:
      return addEdges(state, action);

    case VISUAL_GRAPH_NODE_REMOVED:
      return removeNode(state, action);

    case VISUAL_GRAPH_CLOSE_NODE_INFO_DRAWER:
      return Object.assign({}, state, {
        nodeInfoDrawerOpen: false,
        selectedNode: null
      })
    case VISUAL_GRAPH_OPEN_NODE_INFO_DRAWER:
      return Object.assign({}, state,
        {
          nodeInfoDrawerOpen: true,
          selectedNode: action.node
        })

    default:
      return state
  }
}

function addNode(state, action) {
  const {nodes} = state;
  const newNode = createGraphNode(action.node);
  const newNodes = [newNode, ...nodes];
  return Object.assign({}, state, {nodes: newNodes});
}

function addEdges(state, action) {
  const {nodes, edges} = state;
  const existingNodes = nodes.map(n => n.data.id)

  const addedNodes = action.edges
    .filter(p => !existingNodes.includes(p.to.value))
    .map(p => {
      const {to} = p
      return createGraphNode(to);
    })

  const removeDuplicateEdges = action.edges
    .filter(p => !edges.find(e =>
      e.data.source === p.from.value &&
      e.data.target === p.to.value &&
      e.data.value === p.value))

  // update existing edges to be bi-directional
  const updateBidirectionalEdges = edges.map(e => {
    if (action.edges.find(p =>
      p.from.value === e.data.target &&
      p.to.value === e.data.source &&
      p.value === e.data.value)) {
      return toBidirectionalEdge(e);
    } else
      return e
  })

  console.log(updateBidirectionalEdges);

  const removeAddedBidirectionalEdges = removeDuplicateEdges.filter(p =>
    !updateBidirectionalEdges.find(e => p.from.value === e.data.target &&
      p.to.value === e.data.source &&
      p.value === e.data.value));

  const addedEdges = removeAddedBidirectionalEdges.map(p => createGraphEdge(p))

  if (addedNodes.length > 0 || addedEdges.length > 0) {
    return Object.assign({}, state, {
      nodes: [...addedNodes, ...nodes], edges: [...addedEdges, ...updateBidirectionalEdges]
    })
  } else {
    return state;
  }
}

function removeNode(state, action) {
  const {nodes, edges} = state;
  const remainingEdges = edges.filter(e => e.data.source !== action.uri && e.data.target !== action.uri);
  const remainingNodes = nodes
    .filter(n => n.data.id !== action.uri)
    .filter(n => remainingEdges.find(e => e.data.source === n.data.id || e.data.target === n.data.id))

  return Object.assign({}, state, {nodes: [...remainingNodes], edges: [...remainingEdges]});
}

function toBidirectionalEdge(e) {
  const classes = e.classes.split(" ");
  console.log(classes.filter(c => c !== "unidirectional" && c !== "bidirectional")
    .push("bidirectional"));
  const newClasses = classes
    .filter(c => c !== "unidirectional" && c !== "bidirectional")
    .concat(["bidirectional"]).join(" ");
  return Object.assign({}, e, {classes: newClasses});
}
