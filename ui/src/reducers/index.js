import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {projectReducer} from "./projectReducer";
import {cyReducer} from "./cyReducer";
import {visualGraphReducer} from "./visualGraphReducer";

const rootReducer = combineReducers({
  form: formReducer,
  projectReducer,
  cyReducer,
  visualGraphReducer
});

export default rootReducer;
