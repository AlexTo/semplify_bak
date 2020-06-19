import {
  SPARQL_EXECUTE_TAB,
  SPARQL_NEW_TAB,
  SPARQL_QUERY_RESULTS,
  SPARQL_TAB_EXECUTING,
  SPARQL_REMOVE_TAB,
  SPARQL_SET_CURRENT_TAB,
  SPARQL_UPDATE_CURRENT_TAB,
  SPARQL_OPEN_SAVE_QUERY_DIALOG,
  SPARQL_CLOSE_SAVE_QUERY_DIALOG,
  SPARQL_OPEN_OPEN_QUERY_DIALOG,
  SPARQL_CLOSE_OPEN_QUERY_DIALOG, SPARQL_OPEN_QUERIES, SPARQL_QUERY_ERROR,
} from "../actions/sparqlActions";

import _ from 'lodash';
import {v4 as uuidv4} from "uuid";
import YasqeEditor from "../views/explore/SparqlView/YasqeEditor";
import React from "react";
import {yasqeService} from "../services";

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
      const tab = newTab(null, '', '', null);
      return Object.assign({}, state, {
        tabs: [...state.tabs, tab],
        currentTab: tab
      })

    case SPARQL_REMOVE_TAB:
      const remainingTabs = tabs.filter(t => t !== action.tab);
      let newCurrentTab = currentTab;
      if (remainingTabs.length === 1) {
        newCurrentTab = remainingTabs[0]
      } else if (!remainingTabs.find(t => t === currentTab)) {
        newCurrentTab = remainingTabs[remainingTabs.length - 1]
      }
      yasqeService.clearStorage(action.tab.key);
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

    case SPARQL_QUERY_RESULTS:
      return Object.assign({}, state, {
        executingQueries: state.executingQueries.filter(q => q !== action.tabId),
        queryResults: Object.assign({}, state.queryResults, {
          [action.tabId]: action.results,
        }),
        queryErrors: _.omit(state.queryErrors, [action.tabId]),
      })

    case SPARQL_QUERY_ERROR:
      return Object.assign({}, state, {
        executingQueries: state.executingQueries.filter(q => q !== action.tabId),
        queryErrors: Object.assign({}, state.queryErrors, {
          [action.tabId]: action.error,
        }),
        queryResults: _.omit(state.queryResults, [action.tabId]),
      })

    case SPARQL_OPEN_QUERIES:
      const {queries} = action;
      const unopenedQueries = queries.filter(q => !state.tabs.find(t => t.serverId === q.id));
      console.log(state.tabs);
      console.log(unopenedQueries);
      if (unopenedQueries.length > 0) {
        return Object.assign({}, state, {
          tabs: [...state.tabs, ...(unopenedQueries.map(q => newTab(q.id, q.title, q.description, q.query)))]
        })
      } else {
        return state;
      }

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

function newTab(serverId, title, description, query) {
  const key = uuidv4()
  return {
    key: key,
    value: key,
    title: title,
    description: description,
    serverId: serverId,
    editor: () => <YasqeEditor id={key} query={query}/>
  }
}
