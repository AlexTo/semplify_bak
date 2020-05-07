import {SPARQL_EXECUTE_TAB, SPARQL_QUERY_FINISHED, SPARQL_TAB_EXECUTING} from "../actions/sparqlActions";

const initialState = {
  executingQueries: [],
  queryResults: {},
  executeTab: null
}

export const sparqlReducer = (state = initialState, action) => {
  switch (action.type) {
    case SPARQL_EXECUTE_TAB:
      return Object.assign({}, state, {
        executeTab: action.tabId,
      })

    case SPARQL_TAB_EXECUTING:
      return Object.assign({}, state, {
        executeTab: null,
        executingQueries: [action.tabId, ...state.executingQueries]
      })

    case SPARQL_QUERY_FINISHED:
      return Object.assign({}, state, {
        executingQueries: state.executingQueries.filter(q => q !== action.tabId),
        queryResults: Object.assign({}, state.queryResults, {
          [action.tabId]: action.results,
        })
      })

    default:
      return state
  }
}
