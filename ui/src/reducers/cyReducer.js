import {CY_SET_THEME} from "../actions/cyActions";
import {THEMES} from "../constants";
import {cyThemeLight} from "./cyThemeLight";
import {cyThemeDark} from "./cyThemeDark";

const styles = {
  [THEMES.DARK]: cyThemeDark,
  [THEMES.LIGHT]: cyThemeLight,
  [THEMES.UNICORN]: cyThemeLight
}
const initialState = {
  style: styles[THEMES.LIGHT]
}

export const cyReducer = (state = initialState, action) => {
  switch (action.type) {
    case CY_SET_THEME:
      return Object.assign({}, state, {style: styles[action.theme]})
    default:
      return state;
  }
}

