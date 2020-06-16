export const SEARCH_RESULTS_RETRIEVED = 'SEARCH/RESULTS_RETRIEVED';
export const SEARCH_SET_OFFSET = 'SEARCH/SET_OFFSET';

export const searchActions = {
  setResults,
  setOffset
}

function setResults(results) {
  return dispatch => dispatch({
    type: SEARCH_RESULTS_RETRIEVED,
    results
  })
}

function setOffset(offset) {
  return dispatch => dispatch({
    type: SEARCH_SET_OFFSET,
    offset
  })
}
