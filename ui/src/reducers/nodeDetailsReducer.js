import {
  NODE_DETAILS_CLOSE_VIEW_DIALOG,
  NODE_DETAILS_OPEN_VIEW_DIALOG,
  NODE_DETAILS_SET_NODE
} from "../actions/nodeDetailsActions";

const initialState = {
  projectId: null,
  uri: null,
  nodeDetailsViewDialogOpen: false,
}

export const nodeDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case NODE_DETAILS_SET_NODE:
      return Object.assign({}, state, {
        projectId: action.projectId,
        uri: action.uri
      })
    case NODE_DETAILS_OPEN_VIEW_DIALOG:
      return Object.assign({}, state, {
        nodeDetailsViewDialogOpen: true
      })
    case NODE_DETAILS_CLOSE_VIEW_DIALOG:
      return Object.assign({}, state, {
        nodeDetailsViewDialogOpen: false
      })
    default:
      return state;
  }
}
