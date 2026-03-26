import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import { movieApi } from '../misc/MovieApi'

vi.mock('../misc/MovieApi', () => ({
  movieApi: {
    authenticate: vi.fn(),
  },
}))

// Minimal JWT: header.base64(payload).sig
function makeAccessToken(payload = {}) {
  const defaults = { sub: 'user1', exp: Math.floor(Date.now() / 1000) + 3600, name: 'Alice', rol: ['USER'] }
  return `header.${btoa(JSON.stringify({ ...defaults, ...payload }))}.sig`
}

function HomePage() {
  return <div>Home Page</div>
}

// Render Login with a /login route and a / fallback so Navigate works
function renderLogin() {
  return render(
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<HomePage />} />
    </Routes>,
    { route: '/login' }
  )
}

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  it('redirects to / when already authenticated', () => {
    const user = {
      data: { exp: Math.floor(Date.now() / 1000) + 3600, name: 'Alice', rol: ['USER'] },
      accessToken: 'mock-token',
    }
    localStorage.setItem('user', JSON.stringify(user))

    renderLogin()

    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })

  it('renders the login form when not authenticated', () => {
    renderLogin()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('shows error alert when submitting with empty fields and does not call API', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: /^login$/i }))

    expect(screen.getByText(/incorrect/i)).toBeInTheDocument()
    expect(movieApi.authenticate).not.toHaveBeenCalled()
  })

  it('shows error alert when only username is provided', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText(/username/i), 'testuser')
    await user.click(screen.getByRole('button', { name: /^login$/i }))

    expect(screen.getByText(/incorrect/i)).toBeInTheDocument()
    expect(movieApi.authenticate).not.toHaveBeenCalled()
  })

  it('calls authenticate and logs in user on successful submit', async () => {
    const accessToken = makeAccessToken({ name: 'Alice', rol: ['USER'] })
    movieApi.authenticate.mockResolvedValue({ data: { accessToken } })

    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText(/username/i), 'alice')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /^login$/i }))

    await waitFor(() => {
      expect(movieApi.authenticate).toHaveBeenCalledWith('alice', 'password123')
    })

    // After successful login the user object is stored in localStorage
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('user'))
      expect(stored).not.toBeNull()
      expect(stored.accessToken).toBe(accessToken)
    })
  })

  it('shows error alert when authenticate call fails', async () => {
    movieApi.authenticate.mockRejectedValue({ response: { data: 'Unauthorized' } })

    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText(/username/i), 'alice')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /^login$/i }))

    await waitFor(() => {
      expect(screen.getByText(/incorrect/i)).toBeInTheDocument()
    })
  })

  it('renders social login buttons for Github and Google', () => {
    renderLogin()
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /google/i })).toBeInTheDocument()
  })

  it('renders disabled Facebook and Instagram buttons', () => {
    renderLogin()
    expect(screen.getByRole('button', { name: /facebook/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /instagram/i })).toBeDisabled()
  })

  it('renders a Sign Up link', () => {
    renderLogin()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
  })
})
