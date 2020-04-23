export const CY_SET_THEME = "CY/SET_THEME"

export const cyActions = {
  setTheme
}

function setTheme(theme) {
  return dispatch => dispatch({
    type: CY_SET_THEME,
    theme
  })
}
