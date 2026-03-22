import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '../../test-utils'
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'

function makeUser({ role = 'USER', exp = Math.floor(Date.now() / 1000) + 3600 } = {}) {
  return {
    data: { exp, name: 'Test', rol: [role] },
    accessToken: 'mock-token',
  }
}

function ProtectedContent() {
  return <div>Protected Content</div>
}

function LoginPage() {
  return <div>Login Page</div>
}

// Render PrivateRoute inside a Routes so Navigate works correctly.
// We use a wrapper that adds both the protected route and the /login fallback.
function renderPrivateRoute(initialRoute = '/protected') {
  return render(
    <Routes>
      <Route
        path='/protected'
        element={
          <PrivateRoute>
            <ProtectedContent />
          </PrivateRoute>
        }
      />
      <Route path='/login' element={<LoginPage />} />
    </Routes>,
    { route: initialRoute }
  )
}

describe('PrivateRoute', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders children when the user is authenticated', () => {
    localStorage.setItem('user', JSON.stringify(makeUser()))
    renderPrivateRoute()
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to /login when the user is not authenticated', () => {
    renderPrivateRoute()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('redirects to /login when the token is expired', () => {
    const expiredUser = makeUser({ exp: Math.floor(Date.now() / 1000) - 1 })
    localStorage.setItem('user', JSON.stringify(expiredUser))
    renderPrivateRoute()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
