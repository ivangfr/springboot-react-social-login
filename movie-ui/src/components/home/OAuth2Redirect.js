import React, { Component } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { parseJwt } from '../misc/Helpers'

function withLocation(Component) {
  return props => <Component {...props} location={useLocation()} />;
}

class OAuth2Redirect extends Component {
  static contextType = AuthContext

  state = {
    redirectTo: '/login'
  }

  componentDidMount() {
    const accessToken = this.extractUrlParameter('token')
    if (accessToken) {
      this.handleLogin(accessToken)
      const redirect = "/"
      this.setState({ redirect })
    }
  }

  extractUrlParameter = (key) => {
    return new URLSearchParams(this.props.location.search).get(key)
  }

  handleLogin = (accessToken) => {
    const data = parseJwt(accessToken)
    const user = { data, accessToken }

    const Auth = this.context
    Auth.userLogin(user)
  }

  render() {
    return <Navigate to={this.state.redirectTo} />
  }
}

export default withLocation(OAuth2Redirect)