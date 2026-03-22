import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test-utils'
import { Routes, Route } from 'react-router-dom'
import OAuth2Redirect from './OAuth2Redirect'

// Build a minimal valid JWT: header.base64(payload).sig
function makeToken(payload = {}) {
  const defaults = { sub: 'user1', exp: Math.floor(Date.now() / 1000) + 3600, name: 'Alice', rol: ['USER'] }
  return `header.${btoa(JSON.stringify({ ...defaults, ...payload }))}.sig`
}

function HomePage() {
  return <div>Home Page</div>
}

function LoginPage() {
  return <div>Login Page</div>
}

// Render OAuth2Redirect at /oauth2/redirect with optional search params.
// Also mount / and /login routes so Navigate can resolve.
function renderOAuth2Redirect(search = '') {
  return render(
    <Routes>
      <Route path='/oauth2/redirect' element={<OAuth2Redirect />} />
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
    </Routes>,
    { route: `/oauth2/redirect${search}` }
  )
}

describe('OAuth2Redirect', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  it('navigates to / and stores user when a valid token is in the URL', async () => {
    const token = makeToken({ name: 'Alice', rol: ['USER'] })

    renderOAuth2Redirect(`?token=${token}`)

    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument()
    })

    const stored = JSON.parse(localStorage.getItem('user'))
    expect(stored).not.toBeNull()
    expect(stored.accessToken).toBe(token)
    expect(stored.data.name).toBe('Alice')
  })

  it('navigates to /login when no token is present in the URL', async () => {
    renderOAuth2Redirect()

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })

  it('navigates to /login when token param is empty string', async () => {
    renderOAuth2Redirect('?token=')

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })

  it('stores the correct accessToken in localStorage', async () => {
    const token = makeToken({ name: 'Bob', rol: ['ADMIN'] })

    renderOAuth2Redirect(`?token=${token}`)

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('user'))
      expect(stored.accessToken).toBe(token)
      expect(stored.data.rol[0]).toBe('ADMIN')
    })
  })
})
