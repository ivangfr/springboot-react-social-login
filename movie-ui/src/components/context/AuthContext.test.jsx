import { render, screen, waitFor, act } from '@testing-library/react'
import { makeAdminUser, makeRegularUser, makeExpiredUser, seedLocalStorage } from '../../test-utils'
import { AuthProvider, useAuth } from './AuthContext'
import { MantineProvider } from '@mantine/core'
import { MemoryRouter } from 'react-router-dom'

function AuthProbe() {
  const { user, getUser, userIsAuthenticated, userLogin, userLogout } = useAuth()
  return (
    <div>
      <span data-testid='is-auth'>{String(userIsAuthenticated())}</span>
      <span data-testid='user-name'>{user ? user.data.name : 'none'}</span>
      <button onClick={() => userLogin(makeRegularUser())}>login</button>
      <button onClick={() => userLogout()}>logout</button>
      <span data-testid='get-user'>{getUser() ? getUser().data.name : 'none'}</span>
    </div>
  )
}

function renderProbe(initialUser = null) {
  if (initialUser) seedLocalStorage(initialUser)
  return render(
    <MantineProvider>
      <MemoryRouter>
        <AuthProvider>
          <AuthProbe />
        </AuthProvider>
      </MemoryRouter>
    </MantineProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('AuthContext', () => {
  it('reports not authenticated when localStorage is empty', async () => {
    renderProbe()
    await waitFor(() => {
      expect(screen.getByTestId('is-auth').textContent).toBe('false')
    })
  })

  it('reports authenticated when a valid (non-expired) user is stored', async () => {
    renderProbe(makeAdminUser())
    await waitFor(() => {
      expect(screen.getByTestId('is-auth').textContent).toBe('true')
    })
  })

  it('reports not authenticated and logs out when token is expired', async () => {
    renderProbe(makeExpiredUser())
    await waitFor(() => {
      expect(screen.getByTestId('is-auth').textContent).toBe('false')
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  it('userLogin stores user and updates state', async () => {
    const { getByText, getByTestId } = renderProbe()
    await waitFor(() => expect(getByTestId('user-name').textContent).toBe('none'))

    await act(async () => { getByText('login').click() })

    await waitFor(() => {
      expect(getByTestId('user-name').textContent).toBe('Bob')
      expect(localStorage.getItem('user')).not.toBeNull()
    })
  })

  it('userLogout removes user from localStorage and clears state', async () => {
    const { getByText, getByTestId } = renderProbe(makeRegularUser())
    await waitFor(() => expect(getByTestId('user-name').textContent).toBe('Bob'))

    await act(async () => { getByText('logout').click() })

    await waitFor(() => {
      expect(getByTestId('user-name').textContent).toBe('none')
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  it('getUser returns the parsed user from localStorage', async () => {
    renderProbe(makeRegularUser())
    await waitFor(() => {
      expect(screen.getByTestId('get-user').textContent).toBe('Bob')
    })
  })
})
