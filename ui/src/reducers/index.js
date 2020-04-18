import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {projectReducer} from "./projectReducer";
import {cyReducer} from "./cyReducer";

const rootReducer = combineReducers({
  form: formReducer,
  projectReducer,
  cyReducer
});

export default rootReducer;
