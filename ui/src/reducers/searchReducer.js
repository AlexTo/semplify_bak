import {SEARCH_RESULTS_RETRIEVED, SEARCH_SET_OFFSET} from "../actions";

const initialState = {
  searchHits: [],
  total: 0,
  limit: 15,
  offset: 0
}

export const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_RESULTS_RETRIEVED:
      const {searchHits, total, limit, offset} = action.results;
      return Object.assign({}, state, {
        searchHits, total, limit, offset
      })
    case SEARCH_SET_OFFSET:
      return Object.assign({}, state, {
        offset: action.offset
      })
    default:
      return state;
  }
}
