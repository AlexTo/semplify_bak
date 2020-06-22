export const NODE_DETAILS_SET_NODE = 'NODE_DETAILS/SET_NODE';
export const NODE_DETAILS_OPEN_VIEW_DIALOG = 'NODE_DETAILS/OPEN_VIEW_DIALOG';
export const NODE_DETAILS_CLOSE_VIEW_DIALOG = 'NODE_DETAILS/CLOSE_VIEW_DIALOG';

export const nodeDetailsActions = {
  setNode,
  openNodeDetailsViewDialog,
  closeNodeDetailsViewDialog
}

function setNode(projectId, uri) {
  return dispatch => dispatch({
    type: NODE_DETAILS_SET_NODE,
    projectId, uri
  })
}

function openNodeDetailsViewDialog() {
  return dispatch => dispatch({
    type: NODE_DETAILS_OPEN_VIEW_DIALOG
  })
}

function closeNodeDetailsViewDialog() {
  return dispatch => dispatch({
    type: NODE_DETAILS_CLOSE_VIEW_DIALOG
  })
}
