export const SPARQL_EXECUTE_TAB = "SPARQL/EXECUTE_TAB";
export const SPARQL_NEW_TAB = "SPARQL/NEW_TAB";
export const SPARQL_REMOVE_TAB = "SPARQL/REMOVE_TAB";
export const SPARQL_UPDATE_CURRENT_TAB = "SPARQL/UPDATE_CURRENT_TAB";
export const SPARQL_SET_CURRENT_TAB = "SPARQL/SET_CURRENT_TAB";
export const SPARQL_TAB_EXECUTING = "SPARQL/TAB_EXECUTING";
export const SPARQL_QUERY_RESULTS = "SPARQL/QUERY_RESULTS";
export const SPARQL_QUERY_ERROR = "SPARQL/QUERY_ERROR";
export const SPARQL_OPEN_QUERIES = "SPARQL/OPEN_QUERIES";
export const SPARQL_OPEN_SAVE_QUERY_DIALOG = "SPARQL/OPEN_SAVE_QUERY_DIALOG"
export const SPARQL_CLOSE_SAVE_QUERY_DIALOG = "SPARQL/CLOSE_SAVE_QUERY_DIALOG"
export const SPARQL_OPEN_OPEN_QUERY_DIALOG = "SPARQL/OPEN_OPEN_QUERY_DIALOG"
export const SPARQL_CLOSE_OPEN_QUERY_DIALOG = "SPARQL/CLOSE_OPEN_QUERY_DIALOG"

export const sparqlActions = {
  newTab,
  removeTab,
  updateCurrentTab,
  setCurrentTabByKey,
  execute,
  queryResults,
  queryError,
  tabExecuting,
  openQueries,
  openSaveQueryDialog,
  closeSaveQueryDialog,
  openOpenQueryDialog,
  closeOpenQueryDialog
}

function newTab() {
  return dispatch => dispatch({
    type: SPARQL_NEW_TAB,
  })
}

function openQueries(queries) {
  return dispatch => dispatch({
    type: SPARQL_OPEN_QUERIES,
    queries
  })
}

function openSaveQueryDialog() {
  return dispatch => dispatch({
    type: SPARQL_OPEN_SAVE_QUERY_DIALOG,
  })
}

function closeSaveQueryDialog() {
  return dispatch => dispatch({
    type: SPARQL_CLOSE_SAVE_QUERY_DIALOG
  })
}

function openOpenQueryDialog() {
  return dispatch => dispatch({
    type: SPARQL_OPEN_OPEN_QUERY_DIALOG
  })
}

function closeOpenQueryDialog() {
  return dispatch => dispatch({
    type: SPARQL_CLOSE_OPEN_QUERY_DIALOG
  })
}

function updateCurrentTab(serverId, title, description) {
  return dispatch => dispatch({
    type: SPARQL_UPDATE_CURRENT_TAB,
    serverId, title, description
  })
}

function removeTab(tab) {
  return dispatch => dispatch({
    type: SPARQL_REMOVE_TAB,
    tab
  })
}

function setCurrentTabByKey(key) {
  return dispatch => dispatch({
    type: SPARQL_SET_CURRENT_TAB,
    key
  })
}

function execute() {
  return dispatch => dispatch({
    type: SPARQL_EXECUTE_TAB
  })
}

function tabExecuting(tabId) {
  return dispatch => dispatch({
    type: SPARQL_TAB_EXECUTING,
    tabId
  })
}

function queryResults(tabId, results) {
  return dispatch => dispatch({
    type: SPARQL_QUERY_RESULTS,
    tabId, results
  })
}

function queryError(tabId, error) {
  return dispatch => dispatch({
    type: SPARQL_QUERY_ERROR,
    tabId, error
  })
}
