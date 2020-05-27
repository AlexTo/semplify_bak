import {createGraphEdge, createGraphNode} from '../utils/graph';
import {
  VISUAL_GRAPH_CLOSE_NODE_INFO_DRAWER,
  VISUAL_GRAPH_TRIPLES_ADDED,
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

    case VISUAL_GRAPH_TRIPLES_ADDED:
      return addTriples(state, action);

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

function addTriples(state, action) {
  const {nodes, edges} = state;
  const existingNodes = nodes.map(n => n.data.id)

  const addedNodes = action.triples
    .filter(t => !existingNodes.includes(t.obj.value))
    .map(t => {
      const {obj} = t
      return createGraphNode(obj);
    })

  const removeDuplicateEdges = action.triples
    .filter(t => !edges.find(e =>
      e.data.source === t.subj.value &&
      e.data.value === t.pred.value &&
      e.data.target === t.obj.value))

  // update existing edges to be bi-directional
  const updateBidirectionalEdges = edges.map(e => {
    if (action.triples.find(t =>
      t.subj.value === e.data.target &&
      t.pred.value === e.data.value &&
      t.obj.value === e.data.source)) {
      return toBidirectionalEdge(e);
    } else
      return e
  })

  const removeAddedBidirectionalEdges = removeDuplicateEdges.filter(t =>
    !updateBidirectionalEdges.find(e => t.subj.value === e.data.target &&
      t.pred.value === e.data.value &&
      t.obj.value === e.data.source));

  const addedEdges = removeAddedBidirectionalEdges.map(t => createGraphEdge(t))
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
    .filter(n => (remainingEdges.find(e => e.data.source === n.data.id || e.data.target === n.data.id)) ||
      (!remainingEdges.find(e => e.data.source === n.data.id || e.data.target === n.data.id)
        && (!edges.find(e => (e.data.source === n.data.id && e.data.target === action.uri)
          || (e.data.source === action.uri && e.data.target === n.data.id)))))

  return Object.assign({}, state, {nodes: [...remainingNodes], edges: [...remainingEdges]});
}

function toBidirectionalEdge(e) {
  const classes = e.classes.split(" ");
  const newClasses = classes
    .filter(c => c !== "unidirectional" && c !== "bidirectional")
    .concat(["bidirectional"]).join(" ");
  return Object.assign({}, e, {classes: newClasses});
}
