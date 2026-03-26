import { useContext, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { parseJwt } from '../misc/Helpers'

function OAuth2Redirect() {
  const { userLogin } = useContext(AuthContext)
  const [redirectTo, setRedirectTo] = useState('/login')

  const location = useLocation()

  useEffect(() => {
    const accessToken = new URLSearchParams(location.search).get('token')
    if (accessToken) {
      const data = parseJwt(accessToken)
      userLogin({ data, accessToken })
      setRedirectTo('/')
    }
  }, [location.search, userLogin])

  return <Navigate to={redirectTo} />
}

export default OAuth2Redirect