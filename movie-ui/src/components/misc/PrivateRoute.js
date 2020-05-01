import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function PrivateRoute({ component: Component, ...rest }) {
  const { userIsAuthenticated } = useAuth()

  return <Route {...rest} render={props => (
    userIsAuthenticated()
      ? <Component {...props} />
      : <Redirect to={{ pathname: '/login', state: { referer: props.location } }} />
  )} />
}

export default PrivateRoute