import {CY_SET_THEME} from "../actions";
import {THEMES} from "../constants";
import {cyThemeLight} from "./cyThemeLight";
import {cyThemeDark} from "./cyThemeDark";

const themeMap = {
  [THEMES.DARK]: cyThemeDark,
  [THEMES.LIGHT]: cyThemeLight,
  [THEMES.UNICORN]: cyThemeLight
}
const initialState = {
  theme: themeMap[THEMES.DARK]
}

export const cyReducer = (state = initialState, action) => {
  switch (action.type) {
    case CY_SET_THEME:
      return Object.assign({}, state, {theme: themeMap[action.theme]})
    default:
      return state;
  }
}

