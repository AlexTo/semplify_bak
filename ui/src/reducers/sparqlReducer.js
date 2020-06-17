import {
  SPARQL_EXECUTE_TAB,
  SPARQL_NEW_TAB,
  SPARQL_QUERY_FINISHED,
  SPARQL_TAB_EXECUTING,
  SPARQL_REMOVE_TAB,
  SPARQL_SET_CURRENT_TAB,
  SPARQL_UPDATE_CURRENT_TAB,
  SPARQL_OPEN_SAVE_QUERY_DIALOG,
  SPARQL_CLOSE_SAVE_QUERY_DIALOG,
  SPARQL_OPEN_OPEN_QUERY_DIALOG,
  SPARQL_CLOSE_OPEN_QUERY_DIALOG,
} from "../actions/sparqlActions";

import _ from 'lodash';

const initialState = {
  executingQueries: [],
  queryResults: {},
  queryErrors: {},
  executeTab: null,
  tabs: [],
  currentTab: null,
  saveQueryDialogOpen: false,
  openQueryDialogOpen: false,
}

export const sparqlReducer = (state = initialState, action) => {
  const {tabs, currentTab} = state;
  switch (action.type) {
    case SPARQL_NEW_TAB:
      return Object.assign({}, state, {
        tabs: [...state.tabs, action.tab],
        currentTab: state.tabs.length === 0 ? action.tab : state.currentTab
      })

    case SPARQL_REMOVE_TAB:
      const remainingTabs = tabs.filter(t => t !== action.tab);
      let newCurrentTab = currentTab;
      if (remainingTabs.length === 1) {
        newCurrentTab = remainingTabs[0]
      } else if (!remainingTabs.find(t => t === currentTab)) {
        newCurrentTab = remainingTabs[remainingTabs.length - 1]
      }
      return Object.assign({}, state, {
        tabs: remainingTabs,
        currentTab: newCurrentTab,
        queryResults: _.omit(state.queryResults, [action.tab.key]),
        queryErrors: _.omit(state.queryErrors, [action.tab.key]),
      })

    case SPARQL_SET_CURRENT_TAB:
      return Object.assign({}, state, {
        currentTab: state.tabs.find(t => t.key === action.key)
      })

    case SPARQL_EXECUTE_TAB:
      return Object.assign({}, state, {
        executeTab: currentTab.key,
      })

    case SPARQL_UPDATE_CURRENT_TAB:
      const updatedCurrentTab = Object.assign({}, currentTab, {
        title: action.title,
        description: action.description,
        serverId: action.serverId
      })
      return Object.assign({}, state, {
        tabs: tabs.map(t => {
          if (t.key !== updatedCurrentTab.key)
            return t;
          else return updatedCurrentTab
        }),
        currentTab: updatedCurrentTab
      });

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

    case SPARQL_OPEN_SAVE_QUERY_DIALOG:
      return Object.assign({}, state, {
        saveQueryDialogOpen: true
      })

    case SPARQL_CLOSE_SAVE_QUERY_DIALOG:
      return Object.assign({}, state, {
        saveQueryDialogOpen: false
      })

    case SPARQL_OPEN_OPEN_QUERY_DIALOG:
      return Object.assign({}, state, {
        openQueryDialogOpen: true
      })

    case SPARQL_CLOSE_OPEN_QUERY_DIALOG:
      return Object.assign({}, state, {
        openQueryDialogOpen: false
      })
    default:
      return state
  }
}
