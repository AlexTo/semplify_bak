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
  VISUAL_GRAPH_REFRESH_LAYOUT
} from "../actions";

const initialState = {
  nodes: [],
  edges: [],
  userSettingsDialogOpen: false,
  autoshowNodeDetails: true,
  nodeDetailsPanelOpen: false,
  selectedNode: null,
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
      return refreshGraphWithNewSettings(state, action.settings)

    case VISUAL_GRAPH_UPDATE_LAYOUT:
      return Object.assign({}, state, {layout: action.layout})
    default:
      return state
  }
}

function refreshGraphWithNewSettings(state, settings) {

  if (!settings) return;
  const {nodes, edges} = state;
  const {visualGraph} = settings;
  const {edgeRenderer} = visualGraph;
  const {excludePreds, includePreds, filterMode} = edgeRenderer;
  let remainingEdges = edges;
  let toBeRemovedEdges = [];
  if (filterMode === "Exclusive") {
    const excludedIRIs = excludePreds.map(p => p.value)
    toBeRemovedEdges = edges.filter(e => excludedIRIs.includes(e.data.value));
    if (toBeRemovedEdges.length) {
      remainingEdges = edges.filter(e => !excludedIRIs.includes(e.data.value));
    }
  } else {
    const includedIRIs = includePreds.map(p => p.value)
    toBeRemovedEdges = edges.filter(e => !includedIRIs.includes(e.data.value));
    if (toBeRemovedEdges.length) {
      remainingEdges = edges.filter(e => includedIRIs.includes(e.data.value));
    }
  }

  let remainingNodes = nodes;
  if (toBeRemovedEdges.length) {
    // After removing some edges, some nodes become orphaned.
    // Nodes are orphaned if they are pointed to by a removed edge but none of the remaining edges points to them
    const orphanedNodes = nodes.filter(n =>
      toBeRemovedEdges.find(e => e.data.target === n.data.id) &&
      !remainingEdges.find(e => e.data.target === n.data.id))
    if (orphanedNodes.length) {
      const excludedIRIs = orphanedNodes.map(n => n.data.id);
      remainingNodes = nodes.filter(n => !excludedIRIs.includes(n.data.id))
    }
  }


  return Object.assign({}, state, {
    settings: settings,
    edges: remainingEdges,
    nodes: remainingNodes
  })
}

function addNode(state, action) {
  const {nodes} = state;
  const newNode = createGraphNode(action.node);
  const newNodes = [newNode, ...nodes];
  return Object.assign({}, state, {nodes: newNodes});
}

function addTriples(state, action) {
  const {nodes} = state;

  const triplesFromNormalNodes = action.triples
    .filter(t => !nodes.find(n => n.data.subj === t.subj.value && n.data.pred === t.pred.value));

  const triplesFromCompoundNodes = action.triples
    .filter(t => !isCompound(t.obj) && nodes.find(n => n.data.subj === t.subj.value
      && n.data.pred === t.pred.value));

  let newState = state;

  if (triplesFromNormalNodes.length > 0) {
    newState = renderTriples(newState, triplesFromNormalNodes);
  }

  if (triplesFromCompoundNodes.length > 0) {
    const firstTriple = triplesFromCompoundNodes[0];
    const compoundNode = nodes.find(n => n.data.subj === firstTriple.subj.value
      && n.data.pred === firstTriple.pred.value);
    const transformExistingSubjToCompoundNode = triplesFromCompoundNodes.map(t => {
      const newSubj = {
        projectId: compoundNode.data.projectId,
        value: compoundNode.data.id,
        graph: compoundNode.data.graph
      };
      const newPred = Object.assign(t.pred, {}, {prefLabel: null});
      return Object.assign({}, t, {
        subj: newSubj,
        pred: newPred
      })
    })
    newState = renderTriples(newState, transformExistingSubjToCompoundNode);
  }
  return newState;
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

  return Object.assign({}, state, {
    nodes: [...remainingNodes],
    edges: [...remainingEdges],
    selectedNode: state.selectedNode !== action.uri ? state.selectedNode : null
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

  const addedEdges = removeAddedBidirectionalEdges.map(t => createGraphEdge(t))
  if (addedNodes.length > 0 || addedEdges.length > 0) {
    return Object.assign({}, state, {
      nodes: [...addedNodes, ...nodes], edges: [...addedEdges, ...updateBidirectionalEdges]
    })
  } else {
    return state;
  }
}
