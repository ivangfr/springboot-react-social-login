import React, { Component, useContext } from 'react'

const AuthContext = React.createContext()

class AuthProvider extends Component {
  state = {
    user: null
  }

  componentDidMount() {
    const user = localStorage.getItem('user')
    this.setState({ user })
  }

  getUser = () => {
    return JSON.parse(localStorage.getItem('user'))
  }

  userIsAuthenticated = () => {
    let user = localStorage.getItem('user')
    if (!user) {
      return false
    }
    user = JSON.parse(user)
    
    // if user has token expired, logout user
    if (Date.now() > user.data.exp * 1000) {
      this.userLogout()
      return false
    }
    return true
  }

  userLogin = user => {
    localStorage.setItem('user', JSON.stringify(user))
    this.setState({ user })
  }

  userLogout = () => {
    localStorage.removeItem('user')
    this.setState({ user: null })
  }

  render() {
    const { children } = this.props
    const { user } = this.state
    const { getUser, userIsAuthenticated, userLogin, userLogout } = this

    return (
      <AuthContext.Provider value={{ user, getUser, userIsAuthenticated, userLogin, userLogout, }}>
        {children}
      </AuthContext.Provider>
    )
  }
}

export default AuthContext

export function useAuth() {
  return useContext(AuthContext)
}

export { AuthProvider }