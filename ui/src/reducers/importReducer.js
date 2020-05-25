import {
  IMPORT_CLOSE_IMPORT_DIALOG,
  IMPORT_CLOSE_UPLOAD_DIALOG,
  IMPORT_OPEN_IMPORT_DIALOG,
  IMPORT_OPEN_UPLOAD_DIALOG
} from "../actions";

const initialState = {
  uploadDialogOpen: false,
  importDialogOpen: false,
  fileToImport: null
}

export const importReducer = (state = initialState, action) => {
  switch (action.type) {
    case IMPORT_OPEN_UPLOAD_DIALOG:
      return Object.assign({}, state, {uploadDialogOpen: true})
    case IMPORT_CLOSE_UPLOAD_DIALOG:
      return Object.assign({}, state, {uploadDialogOpen: false})
    case IMPORT_OPEN_IMPORT_DIALOG:
      return Object.assign({}, state, {importDialogOpen: true, fileToImport: action.file})
    case IMPORT_CLOSE_IMPORT_DIALOG:
      return Object.assign({}, state, {importDialogOpen: false, fileToImport: null})
    default:
      return state;
  }
}
