import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {projectReducer} from "./projectReducer";

const rootReducer = combineReducers({
  form: formReducer,
  projectReducer
});

export default rootReducer;
