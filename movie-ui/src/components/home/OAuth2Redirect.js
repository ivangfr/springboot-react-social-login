import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { parseJwt } from '../misc/Helpers'

function OAuth2Redirect() {
  const { userLogin } = useContext(AuthContext)
  const [redirectTo, setRedirectTo] = useState('/login')

  const location = useLocation()

  useEffect(() => {
    const accessToken = extractUrlParameter('token')
    if (accessToken) {
      handleLogin(accessToken)
      const redirect = '/'
      setRedirectTo(redirect)
    }
  }, [])

  const extractUrlParameter = (key) => {
    return new URLSearchParams(location.search).get(key)
  }

  const handleLogin = (accessToken) => {
    const data = parseJwt(accessToken)
    const user = { data, accessToken }

    userLogin(user)
  };

  return <Navigate to={redirectTo} />
}

export default OAuth2Redirect