export const YASQE_SET_THEME = "YASQE/SET_THEME"

export const yasqeActions = {
  setTheme
}

function setTheme(theme) {
  return dispatch => dispatch({
    type: YASQE_SET_THEME,
    theme
  })
}
