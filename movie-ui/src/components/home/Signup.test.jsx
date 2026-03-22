import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import Signup from './Signup'
import { movieApi } from '../misc/MovieApi'

vi.mock('../misc/MovieApi', () => ({
  movieApi: {
    signup: vi.fn(),
  },
}))

function makeAccessToken(payload = {}) {
  const defaults = { sub: 'user1', exp: Math.floor(Date.now() / 1000) + 3600, name: 'Bob', rol: ['USER'] }
  return `header.${btoa(JSON.stringify({ ...defaults, ...payload }))}.sig`
}

function HomePage() {
  return <div>Home Page</div>
}

function renderSignup() {
  return render(
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path='/' element={<HomePage />} />
    </Routes>,
    { route: '/signup' }
  )
}

describe('Signup', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  it('redirects to / when already authenticated', () => {
    const user = {
      data: { exp: Math.floor(Date.now() / 1000) + 3600, name: 'Bob', rol: ['USER'] },
      accessToken: 'mock-token',
    }
    localStorage.setItem('user', JSON.stringify(user))

    renderSignup()

    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })

  it('renders all signup form fields', () => {
    renderSignup()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('shows error alert when any field is empty', async () => {
    const user = userEvent.setup()
    renderSignup()

    // Fill only username — leave rest empty
    await user.type(screen.getByLabelText(/username/i), 'bob')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByText(/please, inform all fields/i)).toBeInTheDocument()
    })
    expect(movieApi.signup).not.toHaveBeenCalled()
  })

  it('shows error when all fields are empty', async () => {
    const user = userEvent.setup()
    renderSignup()

    await user.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByText(/please, inform all fields/i)).toBeInTheDocument()
    })
    expect(movieApi.signup).not.toHaveBeenCalled()
  })

  it('calls signup and stores user on successful submit', async () => {
    const accessToken = makeAccessToken({ name: 'Bob', rol: ['USER'] })
    movieApi.signup.mockResolvedValue({ data: { accessToken } })

    const user = userEvent.setup()
    renderSignup()

    await user.type(screen.getByLabelText(/username/i), 'bob')
    await user.type(screen.getByLabelText(/password/i), 'pass123')
    await user.type(screen.getByLabelText(/^name$/i), 'Bob Smith')
    await user.type(screen.getByLabelText(/email/i), 'bob@example.com')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(movieApi.signup).toHaveBeenCalledWith({
        username: 'bob',
        password: 'pass123',
        name: 'Bob Smith',
        email: 'bob@example.com',
      })
    })

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('user'))
      expect(stored).not.toBeNull()
      expect(stored.accessToken).toBe(accessToken)
    })
  })

  it('shows conflict error message on 409 response', async () => {
    movieApi.signup.mockRejectedValue({
      response: {
        data: { status: 409, message: 'Username already exists!' },
      },
    })

    const user = userEvent.setup()
    renderSignup()

    await user.type(screen.getByLabelText(/username/i), 'bob')
    await user.type(screen.getByLabelText(/password/i), 'pass123')
    await user.type(screen.getByLabelText(/^name$/i), 'Bob')
    await user.type(screen.getByLabelText(/email/i), 'bob@example.com')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByText('Username already exists!')).toBeInTheDocument()
    })
  })

  it('shows validation error message on 400 response', async () => {
    movieApi.signup.mockRejectedValue({
      response: {
        data: {
          status: 400,
          errors: [{ defaultMessage: 'Email must be valid' }],
        },
      },
    })

    const user = userEvent.setup()
    renderSignup()

    await user.type(screen.getByLabelText(/username/i), 'bob')
    await user.type(screen.getByLabelText(/password/i), 'pass123')
    await user.type(screen.getByLabelText(/^name$/i), 'Bob')
    await user.type(screen.getByLabelText(/email/i), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByText('Email must be valid')).toBeInTheDocument()
    })
  })

  it('renders a Login link', () => {
    renderSignup()
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
  })
})
