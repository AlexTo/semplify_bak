import {
  IMPORT_CLOSE_IMPORT_FORM,
  IMPORT_CLOSE_UPLOAD_FORM,
  IMPORT_OPEN_IMPORT_FORM,
  IMPORT_OPEN_UPLOAD_FORM
} from "../actions";

const initialState = {
  uploadFormOpen: false,
  importFormOpen: false,
  fileToImport: null
}

export const importReducer = (state = initialState, action) => {
  switch (action.type) {
    case IMPORT_OPEN_UPLOAD_FORM:
      return Object.assign({}, state, {uploadFormOpen: true})
    case IMPORT_CLOSE_UPLOAD_FORM:
      return Object.assign({}, state, {uploadFormOpen: false})
    case IMPORT_OPEN_IMPORT_FORM:
      return Object.assign({}, state, {importFormOpen: true, fileToImport: action.file})
    case IMPORT_CLOSE_IMPORT_FORM:
      return Object.assign({}, state, {importFormOpen: false, fileToImport: null})
    default:
      return state;
  }
}
