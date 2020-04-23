import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {projectReducer} from "./projectReducer";
import {cyReducer} from "./cyReducer";
import {visualGraphReducer} from "./visualGraphReducer";
import {webCrawlerReducer} from "./webCrawlerReducer";
import {yasqeReducer} from "./yasqeReducer";

const rootReducer = combineReducers({
  form: formReducer,
  projectReducer,
  cyReducer,
  visualGraphReducer,
  webCrawlerReducer,
  yasqeReducer
});

export default rootReducer;
