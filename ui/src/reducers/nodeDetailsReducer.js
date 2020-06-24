import {
  NODE_DETAILS_CLOSE_VIEW_DIALOG, NODE_DETAILS_HIST_BACK, NODE_DETAILS_HIST_FORWARD,
  NODE_DETAILS_OPEN_VIEW_DIALOG,
  NODE_DETAILS_SET_NODE
} from "../actions/nodeDetailsActions";

const initialState = {
  node: null,
  nodeDetailsViewDialogOpen: false,
  histStack: [],
  histIndex: null
}

export const nodeDetailsReducer = (state = initialState, action) => {
  const {histStack, histIndex} = state;
  switch (action.type) {
    case NODE_DETAILS_SET_NODE:
      return Object.assign({}, state, {
        node: action.node,
        histStack: !action.withHistory ? [action.node] : [...histStack, action.node],
        histIndex: !action.withHistory ? 0 : histStack.length
      })
    case NODE_DETAILS_HIST_FORWARD:
      const nextIndex = histIndex < histStack.length - 1 ? histIndex + 1 : histIndex;
      const nextNode = histStack[nextIndex];
      return Object.assign({}, state, {
        node: nextNode,
        histIndex: nextIndex
      })
    case NODE_DETAILS_HIST_BACK:
      const prevIndex = histIndex > 0 ? histIndex - 1 : histIndex;
      const prevNode = histStack[prevIndex];
      return Object.assign({}, state, {
        node: prevNode,
        histIndex: prevIndex
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
