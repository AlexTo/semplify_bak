export const SPARQL_EXECUTE_TAB = "SPARQL/EXECUTE_TAB";
export const SPARQL_QUERY_FINISHED = "SPARQL/QUERY_FINISHED";

export const sparqlActions = {
  executeTab,
  queryFinished,
}

function executeTab(tabId) {
  return dispatch => dispatch({
    type: SPARQL_EXECUTE_TAB,
    tabId
  })
}

function queryFinished(tabId, results) {
  return dispatch => dispatch({
    type: SPARQL_QUERY_FINISHED,
    tabId, results
  })
}
