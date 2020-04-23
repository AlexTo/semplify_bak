export const PROJECT_ACTIVATE = "PROJECT/ACTIVATE";

export const projectActions = {
  activate
}

function activate(projectId, projectTitle) {
  return dispatch => dispatch({
    type: PROJECT_ACTIVATE,
    projectId, projectTitle
  })
}
