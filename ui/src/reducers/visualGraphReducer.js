import {createGraphEdge, createGraphNode, isCompound} from '../utils/graph';
import {
  VISUAL_GRAPH_TRIPLES_ADDED,
  VISUAL_GRAPH_NODE_ADDED,
  VISUAL_GRAPH_NODE_REMOVED,
  VISUAL_GRAPH_CLEAR,
  VISUAL_GRAPH_TOGGLE_AUTOSHOW_NODE_DETAILS,
  VISUAL_GRAPH_NODE_SELECTED,
  VISUAL_GRAPH_CENTER_FOCUS,
  VISUAL_GRAPH_FIT,
  VISUAL_GRAPH_OPEN_USER_SETTINGS_DIALOG,
  VISUAL_GRAPH_CLOSE_USER_SETTINGS_DIALOG,
  VISUAL_GRAPH_UPDATE_SETTINGS,
  VISUAL_GRAPH_UPDATE_LAYOUT,
  VISUAL_GRAPH_REFRESH_LAYOUT,
  VISUAL_GRAPH_OPEN_COMPOUND_NODE_EXPANSION_DIALOG,
  VISUAL_GRAPH_CLOSE_COMPOUND_NODE_EXPANSION_DIALOG,
} from "../actions";

const initialState = {
  nodes: [],
  edges: [],
  userSettingsDialogOpen: false,
  autoshowNodeDetails: true,
  nodeDetailsPanelOpen: false,
  compoundNodeExpansionDialogOpen: false,
  selectedNode: null,
  selectedCompoundNode: null,
  centerFocus: 1,
  fit: 1,
  refreshLayout: 1,
  layout: {name: "cola", label: "Cola"},
  settings: null
}

export const visualGraphReducer = (state = initialState, action) => {

  switch (action.type) {
    case VISUAL_GRAPH_OPEN_USER_SETTINGS_DIALOG:
      return Object.assign({}, state, {userSettingsDialogOpen: true})

    case VISUAL_GRAPH_CLOSE_USER_SETTINGS_DIALOG:
      return Object.assign({}, state, {userSettingsDialogOpen: false})

    case VISUAL_GRAPH_OPEN_COMPOUND_NODE_EXPANSION_DIALOG:
      return Object.assign({}, state, {
        compoundNodeExpansionDialogOpen: true,
        selectedCompoundNode: action.node
      })

    case VISUAL_GRAPH_CLOSE_COMPOUND_NODE_EXPANSION_DIALOG:
      return Object.assign({}, state, {
        compoundNodeExpansionDialogOpen: false,
        selectedCompoundNode: null
      })

    case VISUAL_GRAPH_REFRESH_LAYOUT:
      return Object.assign({}, state, {refreshLayout: state.refreshLayout * -1});

    case VISUAL_GRAPH_CLEAR:
      return Object.assign({}, state, {nodes: [], edges: [], selectedNode: null});

    case VISUAL_GRAPH_CENTER_FOCUS:
      return Object.assign({}, state, {centerFocus: state.centerFocus * -1});

    case VISUAL_GRAPH_FIT:
      return Object.assign({}, state, {fit: state.fit * -1});

    case VISUAL_GRAPH_NODE_ADDED:
      return addNode(state, action);

    case VISUAL_GRAPH_NODE_SELECTED:
      return Object.assign({}, state, {
        selectedNode: action.node,
        nodeDetailsPanelOpen: !action.node ? false : state.autoshowNodeDetails
      });

    case VISUAL_GRAPH_TRIPLES_ADDED:
      return addTriples(state, action);

    case VISUAL_GRAPH_NODE_REMOVED:
      return removeNode(state, action);

    case VISUAL_GRAPH_TOGGLE_AUTOSHOW_NODE_DETAILS:
      return Object.assign({}, state, {
        autoshowNodeDetails: !state.autoshowNodeDetails,
        nodeDetailsPanelOpen: state.autoshowNodeDetails ? false : state.nodeDetailsPanelOpen
      });

    case VISUAL_GRAPH_UPDATE_SETTINGS:
      return Object.assign({}, state, {
        settings: action.settings
      })

    case VISUAL_GRAPH_UPDATE_LAYOUT:
      return Object.assign({}, state, {layout: action.layout})
    default:
      return state
  }
}

function addNode(state, action) {
  const {nodes} = state;
  const newNode = createGraphNode(action.node);
  const newNodes = [newNode, ...nodes];

  return Object.assign({}, state, {
    nodes: newNodes,
    refreshLayout: newNodes.length > 1 ? state.refreshLayout * -1 : state.refreshLayout,
    centerFocus: newNodes.length === 1 ? state.centerFocus * -1 : state.centerFocus
  });
}

function addTriples(state, action) {
  const {nodes} = state;

  const triplesWithNormalNodes = action.triples
    .filter(t => !nodes.find(n => n.data.subj === t.subj.value && n.data.pred === t.pred.value));

  const triplesWithCompoundNodes = action.triples
    .filter(t => !isCompound(t.obj) && nodes.find(n => n.data.subj === t.subj.value
      && n.data.pred === t.pred.value));

  let newState = state;

  if (triplesWithNormalNodes.length > 0) {
    newState = renderTriples(newState, triplesWithNormalNodes);
  }

  if (triplesWithCompoundNodes.length > 0) {
    const firstTriple = triplesWithCompoundNodes[0];
    const compoundNode = nodes.find(n => n.data.subj === firstTriple.subj.value
      && n.data.pred === firstTriple.pred.value);
    const transformExistingSubjToCompoundNode = triplesWithCompoundNodes.map(t => {
      const newSubj = {
        projectId: compoundNode.data.projectId,
        value: compoundNode.data.id,
        graph: compoundNode.data.graph
      };
      const newPred = Object.assign(t.pred, {}, {prefLabel: null});
      const newObj = Object.assign(t.obj, {}, {parent: newSubj.value})
      return Object.assign({}, t, {
        subj: newSubj,
        pred: newPred,
        obj: newObj
      })
    })
    newState = renderTriples(newState, transformExistingSubjToCompoundNode);
  }
  if (newState.nodes.length > state.nodes.length) {
    newState = Object.assign({}, newState, {refreshLayout: newState.refreshLayout * -1})
  }
  return newState;
}

function removeNode(state, action) {
  const {nodes, edges} = state;
  const {node} = action;
  const remainingEdges = edges.filter(e => !isEdgeOf(e, node));

  const remainingNodes = nodes
    .filter(n => n.data.id !== node.id() && !belongToCompoundNode(n, node))

  return Object.assign({}, state, {
    nodes: [...remainingNodes],
    edges: [...remainingEdges],
    selectedNode: state.selectedNode !== node ? state.selectedNode : null
  });
}

function toBidirectionalEdge(e) {
  const classes = e.classes.split(" ");
  const newClasses = classes
    .filter(c => c !== "unidirectional" && c !== "bidirectional")
    .concat(["bidirectional"]).join(" ");
  return Object.assign({}, e, {classes: newClasses});
}

function renderTriples(state, triples) {
  const {nodes, edges} = state;
  const existingNodeIds = nodes.map(n => n.data.id)
  const addedNodes = triples
    .filter(t => !existingNodeIds.includes(t.obj.value))
    .map(t => {
      const {obj} = t
      return createGraphNode(obj);
    })

  const removeDuplicateEdges = triples
    .filter(t => !edges.find(e =>
      e.data.source === t.subj.value &&
      e.data.value === t.pred.value &&
      e.data.target === t.obj.value))

  // update existing edges to be bi-directional
  const updateBidirectionalEdges = edges.map(e => {
    if (triples.find(t =>
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

  const addedEdges = removeAddedBidirectionalEdges
    .filter(t => !isCompound(t.subj))
    .map(t => createGraphEdge(t))
  if (addedNodes.length > 0 || addedEdges.length > 0) {
    return Object.assign({}, state, {
      nodes: [...addedNodes, ...nodes], edges: [...addedEdges, ...updateBidirectionalEdges]
    })
  } else {
    return state;
  }
}

function isEdgeOf(edge, node) {
  return edge.data.source === node.id() || edge.data.target === node.id();
}

function belongToCompoundNode(node1, node2) {
  return node1.data.parent && node1.data.parent === node2.id()
}
