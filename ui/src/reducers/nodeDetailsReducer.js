import {NODE_DETAILS_SET_NODE} from "../actions/nodeDetailsActions";

const initialState = {
  projectId: null,
  uri: null
}

export const nodeDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case NODE_DETAILS_SET_NODE:
      return Object.assign({}, state, {
        projectId: action.projectId,
        uri: action.uri
      })
    default:
      return state;
  }
}
