import React from 'react'
import {Route, Redirect} from 'react-router-dom'

import {useKeycloak} from '@react-keycloak/web'
import LoadingScreen from "./LoadingScreen";

export function AuthGuard({component: Component, ...rest}) {
  const [keycloak, initialized] = useKeycloak()

  if (!initialized) {
    return <LoadingScreen/>
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        keycloak.authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {from: props.location},
            }}
          />
        )
      }
    />
  )
}
