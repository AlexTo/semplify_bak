export const NODE_DETAILS_SET_NODE = 'NODE_DETAILS/SET_NODE';

export const nodeDetailsActions = {
  setNode
}

function setNode(projectId, uri) {
  return dispatch => dispatch({
    type: NODE_DETAILS_SET_NODE,
    projectId, uri
  })
}
