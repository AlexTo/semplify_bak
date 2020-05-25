export const IMPORT_OPEN_UPLOAD_DIALOG = "IMPORT/OPEN_UPLOAD_DIALOG";
export const IMPORT_CLOSE_UPLOAD_DIALOG = "IMPORT/CLOSE_UPLOAD_DIALOG";
export const IMPORT_OPEN_IMPORT_DIALOG = "IMPORT/OPEN_IMPORT_DIALOG";
export const IMPORT_CLOSE_IMPORT_DIALOG = "IMPORT/CLOSE_IMPORT_DIALOG";

export const importActions = {
  openUploadDialog,
  closeUploadDialog,
  openImportDialog,
  closeImportDialog
}

function openUploadDialog() {
  return dispatch => dispatch({
    type: IMPORT_OPEN_UPLOAD_DIALOG
  })
}

function closeUploadDialog() {
  return dispatch => dispatch({
    type: IMPORT_CLOSE_UPLOAD_DIALOG
  })
}

function openImportDialog(file) {
  return dispatch => dispatch({
    type: IMPORT_OPEN_IMPORT_DIALOG,
    file
  })
}

function closeImportDialog() {
  return dispatch => dispatch({
    type: IMPORT_CLOSE_IMPORT_DIALOG
  })
}
