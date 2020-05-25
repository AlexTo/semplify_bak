import {PROJECT_ACTIVATE, PROJECT_CLOSE_NEW_PROJECT_DIALOG, PROJECT_OPEN_NEW_PROJECT_DIALOG} from "../actions";

const initialState = {
  projectId: "",
  projectTitle: "",
  newProjectDialogOpen: false
}

export const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_ACTIVATE:
      return Object.assign({}, state, {
        projectId: action.projectId,
        projectTitle: action.projectTitle
      })
    case PROJECT_OPEN_NEW_PROJECT_DIALOG:
      return Object.assign({}, state, {
        newProjectDialogOpen: true
      })
    case PROJECT_CLOSE_NEW_PROJECT_DIALOG:
      return Object.assign({}, state, {
        newProjectDialogOpen: false
      })
    default:
      return state;
  }
}
