import {PROJECT_ACTIVATE} from "../actions/projectActions";

const initialState = {
  projectId: "",
  projectTitle: ""
}

export const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_ACTIVATE:
      return Object.assign({}, state, {
        projectId: action.projectId,
        projectTitle: action.projectTitle
      })
    default:
      return state;
  }
}
