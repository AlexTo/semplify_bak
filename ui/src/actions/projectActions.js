export const PROJECT_ACTIVATE = "PROJECT/ACTIVATE";
export const PROJECT_OPEN_NEW_PROJECT_DIALOG = "PROJECT/OPEN_NEW_PROJECT_DIALOG"
export const PROJECT_CLOSE_NEW_PROJECT_DIALOG = "PROJECT/CLOSE_NEW_PROJECT_DIALOG"

export const projectActions = {
  activate,
  openNewProjectDialog,
  closeNewProjectDialog
}

function activate(projectId, projectTitle) {
  return dispatch => dispatch({
    type: PROJECT_ACTIVATE,
    projectId, projectTitle
  })
}

function openNewProjectDialog() {
  return dispatch => dispatch({
    type: PROJECT_OPEN_NEW_PROJECT_DIALOG
  })
}

function closeNewProjectDialog() {
  return dispatch => dispatch({
    type: PROJECT_CLOSE_NEW_PROJECT_DIALOG
  })
}
