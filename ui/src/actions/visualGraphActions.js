export const VISUAL_GRAPH_CLEAR = 'VISUAL_GRAPH/CLEAR';
export const VISUAL_GRAPH_NODE_ADDED = 'VISUAL_GRAPH/NODE_ADDED';
export const VISUAL_GRAPH_NODE_SELECTED = 'VISUAL_GRAPH/NODE_SELECTED';
export const VISUAL_GRAPH_TRIPLES_ADDED = 'VISUAL_GRAPH/TRIPLES_ADDED';
export const VISUAL_GRAPH_NODE_REMOVED = 'VISUAL_GRAPH/NODE_REMOVED';
export const VISUAL_GRAPH_TOGGLE_AUTOSHOW_NODE_DETAILS = 'VISUAL_GRAPH/TOGGLE_AUTOSHOW_NODE_DETAILS';
export const VISUAL_GRAPH_CENTER_FOCUS = 'VISUAL_GRAPH/CENTER_FOCUS';
export const VISUAL_GRAPH_FIT = 'VISUAL_GRAPH/FIT';
export const VISUAL_GRAPH_OPEN_USER_SETTINGS_DIALOG = 'VISUAL_GRAPH/OPEN_USER_SETTINGS_DIALOG'
export const VISUAL_GRAPH_CLOSE_USER_SETTINGS_DIALOG = 'VISUAL_GRAPH/CLOSE_USER_SETTINGS_DIALOG'
export const VISUAL_GRAPH_UPDATE_SETTINGS = 'VISUAL_GRAPH/UPDATE_SETTINGS';
export const VISUAL_GRAPH_UPDATE_LAYOUT = 'VISUAL_GRAPH/UPDATE_LAYOUT';
export const VISUAL_GRAPH_REFRESH_LAYOUT = 'VISUAL_GRAPH/REFRESH_LAYOUT';

export const visualGraphActions = {
  clear,
  centerFocus,
  fit,
  selectNode,
  addNode,
  removeNode,
  addTriples,
  toggleAutoshowNodeDetails,
  openUserSettingsDialog,
  closeUserSettingsDialog,
  updateSettings,
  updateLayout,
  refreshLayout
}

function refreshLayout() {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_REFRESH_LAYOUT
  })
}

function updateLayout(layout) {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_UPDATE_LAYOUT,
    layout
  })
}

function updateSettings(settings) {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_UPDATE_SETTINGS,
    settings
  })
}

function openUserSettingsDialog() {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_OPEN_USER_SETTINGS_DIALOG
  })
}

function closeUserSettingsDialog() {
  return dispatch => dispatch({
    type: VISUAL_GRAPH_CLOSE_USER_SETTINGS_DIALOG
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

