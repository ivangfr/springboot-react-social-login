import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    setUser(storedUser)
  }, [])

  const getUser = () => {
    return JSON.parse(localStorage.getItem('user'))
  }

  const userIsAuthenticated = () => {
    let storedUser = localStorage.getItem('user')
    if (!storedUser) {
      return false
    }
    storedUser = JSON.parse(storedUser)

    // if user has token expired, logout user
    if (Date.now() > storedUser.data.exp * 1000) {
      userLogout()
      return false
    }
    return true
  }

  const userLogin = user => {
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  const userLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const contextValue = {
    user,
    getUser,
    userIsAuthenticated,
    userLogin,
    userLogout,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

export function useAuth() {
  return useContext(AuthContext)
}

export { AuthProvider }