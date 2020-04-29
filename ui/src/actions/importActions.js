export const IMPORT_OPEN_UPLOAD_FORM = "IMPORT/OPEN_UPLOAD_FORM";
export const IMPORT_CLOSE_UPLOAD_FORM = "IMPORT/CLOSE_UPLOAD_FORM";
export const IMPORT_OPEN_IMPORT_FORM = "IMPORT/OPEN_IMPORT_FORM";
export const IMPORT_CLOSE_IMPORT_FORM = "IMPORT/CLOSE_IMPORT_FORM";

export const importActions = {
    openUploadForm,
    closeUploadForm,
    openImportForm,
    closeImportForm
}

function openUploadForm() {
    return dispatch => dispatch({
        type: IMPORT_OPEN_UPLOAD_FORM
    })
}

function closeUploadForm() {
    return dispatch => dispatch({
        type: IMPORT_CLOSE_UPLOAD_FORM
    })
}

function openImportForm(file) {
    return dispatch => dispatch({
        type: IMPORT_OPEN_IMPORT_FORM,
        file
    })
}

function closeImportForm() {
    return dispatch => dispatch({
        type: IMPORT_CLOSE_IMPORT_FORM
    })
}
