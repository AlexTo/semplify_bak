export const SESSION_LOGGED_OUT = "SESSION/LOGGED_OUT"

export const sessionActions = {
  logout
}

function logout() {
  return dispatch => dispatch({
    type: SESSION_LOGGED_OUT
  })
}
