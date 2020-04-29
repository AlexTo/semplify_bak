import {SESSION_LOGGED_OUT, YASQE_SET_THEME} from "../actions";
import {THEMES} from "../constants";

const themeMap = {
  [THEMES.DARK]: "darcula",
  [THEMES.LIGHT]: "default",
  [THEMES.UNICORN]: "default"
}
const initialState = {
  theme: themeMap[THEMES.DARK],
}

export const yasqeReducer = (state = initialState, action) => {
  switch (action.type) {
    case YASQE_SET_THEME:
      return Object.assign({}, state, {theme: themeMap[action.theme]})
    default:
      return state;
  }
}

