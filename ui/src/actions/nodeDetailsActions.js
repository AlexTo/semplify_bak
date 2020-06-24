export const NODE_DETAILS_SET_NODE = 'NODE_DETAILS/SET_NODE';
export const NODE_DETAILS_OPEN_VIEW_DIALOG = 'NODE_DETAILS/OPEN_VIEW_DIALOG';
export const NODE_DETAILS_CLOSE_VIEW_DIALOG = 'NODE_DETAILS/CLOSE_VIEW_DIALOG';
export const NODE_DETAILS_HIST_BACK = 'NODE_DETAILS/HIST_BACK';
export const NODE_DETAILS_HIST_FORWARD = 'NODE_DETAILS/HIST_FORWARD';

export const nodeDetailsActions = {
  histBack,
  histForward,
  setNode,
  openNodeDetailsViewDialog,
  closeNodeDetailsViewDialog
}

function setNode(node, withHistory = false) {
  return dispatch => dispatch({
    type: NODE_DETAILS_SET_NODE,
    node, withHistory
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

function histBack() {
  return dispatch => dispatch({
    type: NODE_DETAILS_HIST_BACK
  })
}

function histForward() {
  return dispatch => dispatch({
    type: NODE_DETAILS_HIST_FORWARD
  })
}
