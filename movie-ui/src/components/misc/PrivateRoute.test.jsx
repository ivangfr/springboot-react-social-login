import { screen } from '@testing-library/react'
import { render, makeRegularUser, makeExpiredUser, seedLocalStorage } from '../../test-utils'
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'

function ProtectedContent() {
  return <div>Protected Content</div>
}

function LoginPage() {
  return <div>Login Page</div>
}

function renderPrivateRoute(initialRoute = '/protected') {
  return render(
    <Routes>
      <Route path='/protected' element={<PrivateRoute><ProtectedContent /></PrivateRoute>} />
      <Route path='/login' element={<LoginPage />} />
    </Routes>,
    { route: initialRoute }
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('PrivateRoute', () => {
  it('renders children when the user is authenticated', () => {
    seedLocalStorage(makeRegularUser())
    renderPrivateRoute()
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to /login when the user is not authenticated', () => {
    renderPrivateRoute()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('redirects to /login when the token is expired', () => {
    seedLocalStorage(makeExpiredUser())
    renderPrivateRoute()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
