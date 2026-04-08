import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, makeRegularUser, seedLocalStorage, makeToken } from '../../test-utils'
import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import { movieApi } from '../misc/MovieApi'

vi.mock('../misc/MovieApi')

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

function HomePage() {
  return <div>Home Page</div>
}

function renderLogin(initialRoute = '/login') {
  return render(
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<HomePage />} />
    </Routes>,
    { route: initialRoute }
  )
}

describe('Login', () => {
  it('redirects to / when already logged in', () => {
    seedLocalStorage(makeRegularUser())
    renderLogin()
    expect(screen.queryByLabelText('Username')).not.toBeInTheDocument()
  })

  it('shows error alert when submitting with empty fields', async () => {
    renderLogin()
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows error alert when API returns an error', async () => {
    movieApi.authenticate.mockRejectedValue({ message: 'Unauthorized' })
    renderLogin()

    await userEvent.type(screen.getByLabelText('Username'), 'alice')
    await userEvent.type(screen.getByLabelText('Password'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('calls userLogin and clears fields on successful authentication', async () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600
    const payload = { sub: 'alice', rol: ['USER'], name: 'Alice', exp: futureExp }
    movieApi.authenticate.mockResolvedValue({ data: { accessToken: makeToken(payload) } })

    renderLogin()

    await userEvent.type(screen.getByLabelText('Username'), 'alice')
    await userEvent.type(screen.getByLabelText('Password'), 'secret')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(localStorage.getItem('user')).not.toBeNull()
    })
  })
})
