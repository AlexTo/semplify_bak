import {PROJECT_ACTIVATE} from "../actions/projectActions";

const initialState = {
  projectId: "5e8943b050040030a6ee3942",
  projectTitle: "Mathematics Curriculum"
}

export const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_ACTIVATE:
      return Object.assign({}, state, {
        projectId: action.projectId, projectTitle: action.projectTitle
      })
    default:
      return state;
  }
}
