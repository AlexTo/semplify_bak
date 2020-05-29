export const VISUAL_GRAPH_CLEAR = 'VISUAL_GRAPH/CLEAR';
export const VISUAL_GRAPH_NODE_ADDED = 'VISUAL_GRAPH/NODE_ADDED';
export const VISUAL_GRAPH_NODE_SELECTED = 'VISUAL_GRAPH/NODE_SELECTED';
export const VISUAL_GRAPH_TRIPLES_ADDED = 'VISUAL_GRAPH/TRIPLES_ADDED';
export const VISUAL_GRAPH_NODE_REMOVED = 'VISUAL_GRAPH/NODE_REMOVED';
export const VISUAL_GRAPH_TOGGLE_AUTOSHOW_NODE_DETAILS = 'VISUAL_GRAPH/TOGGLE_AUTOSHOW_NODE_DETAILS';
export const VISUAL_GRAPH_CENTER_FOCUS = 'VISUAL_GRAPH/CENTER_FOCUS';
export const VISUAL_GRAPH_FIT = 'VISUAL_GRAPH/FIT';
export const VISUAL_GRAPH_OPEN_SETTINGS_DRAWER = "VISUAL_GRAPH/OPEN_SETTINGS_DRAWER";
export const VISUAL_GRAPH_CLOSE_SETTINGS_DRAWER = "VISUAL_GRAPH/CLOSE_SETTINGS_DRAWER";

export const visualGraphActions = {
  clear,
  centerFocus,
  fit,
  selectNode,
  addNode,
  removeNode,
  addTriples,
  toggleAutoshowNodeDetails,
  openSettingsDrawer,
  closeSettingsDrawer
}

function openSettingsDrawer() {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_OPEN_SETTINGS_DRAWER
  })
}

function closeSettingsDrawer() {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_CLOSE_SETTINGS_DRAWER
  })
}

function clear() {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_CLEAR
  })
}

function centerFocus() {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_CENTER_FOCUS
  })
}

function fit() {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_FIT
  })
}

function toggleAutoshowNodeDetails() {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_TOGGLE_AUTOSHOW_NODE_DETAILS
  })
}

function removeNode(uri) {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_NODE_REMOVED,
    uri
  })
}

function selectNode(node) {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_NODE_SELECTED,
    node
  })
}

function addNode(node) {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_NODE_ADDED,
    node
  })
}

function addTriples(triples) {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_TRIPLES_ADDED,
    triples
  })
}

