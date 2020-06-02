import {combineReducers} from 'redux';
import {projectReducer} from "./projectReducer";
import {cyReducer} from "./cyReducer";
import {visualGraphReducer} from "./visualGraphReducer";
import {webCrawlerReducer} from "./webCrawlerReducer";
import {yasqeReducer} from "./yasqeReducer";
import {sparqlReducer} from "./sparqlReducer";
import {importReducer} from "./importReducer";

const rootReducer = combineReducers({
  projectReducer,
  cyReducer,
  visualGraphReducer,
  webCrawlerReducer,
  yasqeReducer,
  sparqlReducer,
  importReducer
});

export default rootReducer;
