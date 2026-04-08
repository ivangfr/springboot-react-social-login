import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, makeRegularUser, seedLocalStorage, makeToken } from '../../test-utils'
import { Routes, Route } from 'react-router-dom'
import Signup from './Signup'
import { movieApi } from '../misc/MovieApi'

vi.mock('../misc/MovieApi')

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

async function fillForm({ username = 'alice', password = 'secret', name = 'Alice', email = 'alice@example.com' } = {}) {
  if (username) await userEvent.type(screen.getByLabelText('Username'), username)
  if (password) await userEvent.type(screen.getByLabelText('Password'), password)
  if (name) await userEvent.type(screen.getByLabelText('Name'), name)
  if (email) await userEvent.type(screen.getByLabelText('Email'), email)
}

function HomePage() {
  return <div>Home Page</div>
}

function renderSignup(initialRoute = '/signup') {
  return render(
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path='/' element={<HomePage />} />
    </Routes>,
    { route: initialRoute }
  )
}

describe('Signup', () => {
  it('redirects to / when already logged in', () => {
    seedLocalStorage(makeRegularUser())
    renderSignup()
    expect(screen.queryByLabelText('Username')).not.toBeInTheDocument()
  })

  it('shows error alert when any required field is missing', async () => {
    renderSignup()
    await userEvent.type(screen.getByLabelText('Username'), 'alice')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows conflict message on 409 response', async () => {
    movieApi.signup.mockRejectedValue({
      response: { data: { status: 409, message: 'Username already in use' } },
    })
    renderSignup()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    await waitFor(() => {
      expect(screen.getByText('Username already in use')).toBeInTheDocument()
    })
  })

  it('shows validation message on 400 response', async () => {
    movieApi.signup.mockRejectedValue({
      response: {
        data: {
          status: 400,
          errors: [{ defaultMessage: 'Email must be valid' }],
        },
      },
    })
    renderSignup()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    await waitFor(() => {
      expect(screen.getByText('Email must be valid')).toBeInTheDocument()
    })
  })

  it('stores user in localStorage on successful signup', async () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600
    const payload = { sub: 'alice', rol: ['USER'], name: 'Alice', exp: futureExp }
    movieApi.signup.mockResolvedValue({ data: { accessToken: makeToken(payload) } })

    renderSignup()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(localStorage.getItem('user')).not.toBeNull()
    })
  })
})
