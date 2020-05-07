export const SPARQL_EXECUTE_TAB = "SPARQL/EXECUTE_TAB";
export const SPARQL_TAB_EXECUTING = "SPARQL/TAB_EXECUTING";
export const SPARQL_QUERY_FINISHED = "SPARQL/QUERY_FINISHED";

export const sparqlActions = {
  executeTab,
  queryFinished,
  tabExecuting
}

function executeTab(tabId) {
  return dispatch => dispatch({
    type: SPARQL_EXECUTE_TAB,
    tabId
  })
}

function tabExecuting(tabId) {
  return dispatch => dispatch({
    type: SPARQL_TAB_EXECUTING,
    tabId
  })
}

function queryFinished(tabId, results, error) {
  return dispatch => dispatch({
    type: SPARQL_QUERY_FINISHED,
    tabId, results
  })
}
