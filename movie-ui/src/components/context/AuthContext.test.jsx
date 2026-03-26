import { describe, it, expect, beforeEach } from 'vitest'
import { render as plainRender, screen, act, waitFor } from '@testing-library/react'
import { useAuth, AuthProvider } from './AuthContext'
import { MantineProvider } from '@mantine/core'

// Helper: build a user object matching the token shape used by the app
function makeUser({ role = 'USER', exp = Math.floor(Date.now() / 1000) + 3600, name = 'Test User' } = {}) {
  return {
    data: { exp, name, rol: [role] },
    accessToken: 'mock-access-token',
  }
}

// Consumer component that exposes auth context values via data-testid attributes
function AuthConsumer() {
  const { user, getUser, userIsAuthenticated, userLogin, userLogout } = useAuth()
  return (
    <div>
      <span data-testid='user'>{user ? user.data.name : 'null'}</span>
      <span data-testid='get-user'>{getUser() ? getUser().data.name : 'null'}</span>
      <span data-testid='is-authenticated'>{String(userIsAuthenticated())}</span>
      <button data-testid='login' onClick={() => userLogin(makeUser({ name: 'Alice' }))} />
      <button data-testid='logout' onClick={() => userLogout()} />
    </div>
  )
}

// renderWithProviders wraps in MemoryRouter + AuthProvider + MantineProvider, which would
// cause a "cannot render Router inside another Router" error here. Use plain render from
// @testing-library/react and supply only the providers this file needs.
function renderAuthConsumer() {
  return plainRender(
    <MantineProvider>
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    </MantineProvider>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with null user and unauthenticated when localStorage is empty', async () => {
    renderAuthConsumer()
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('null')
    })
    expect(screen.getByTestId('is-authenticated').textContent).toBe('false')
  })

  it('hydrates user state from localStorage on mount', async () => {
    const storedUser = makeUser({ name: 'Bob' })
    localStorage.setItem('user', JSON.stringify(storedUser))

    renderAuthConsumer()

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('Bob')
    })
  })

  it('userLogin stores user in localStorage and updates user state', async () => {
    renderAuthConsumer()

    await act(async () => {
      screen.getByTestId('login').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('Alice')
    })
    const stored = JSON.parse(localStorage.getItem('user'))
    expect(stored.data.name).toBe('Alice')
    expect(stored.accessToken).toBe('mock-access-token')
  })

  it('userLogout removes user from localStorage and sets user state to null', async () => {
    const storedUser = makeUser({ name: 'Carol' })
    localStorage.setItem('user', JSON.stringify(storedUser))
    renderAuthConsumer()

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('Carol')
    })

    await act(async () => {
      screen.getByTestId('logout').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('null')
    })
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('userIsAuthenticated returns true when token is not expired', async () => {
    const storedUser = makeUser({ exp: Math.floor(Date.now() / 1000) + 3600 })
    localStorage.setItem('user', JSON.stringify(storedUser))
    renderAuthConsumer()

    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated').textContent).toBe('true')
    })
  })

  it('userIsAuthenticated returns false and logs out when token is expired', async () => {
    const expiredUser = makeUser({ exp: Math.floor(Date.now() / 1000) - 1 })
    localStorage.setItem('user', JSON.stringify(expiredUser))
    renderAuthConsumer()

    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated').textContent).toBe('false')
    })
    // userLogout is called internally — localStorage entry is removed
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('userIsAuthenticated returns false when localStorage is empty', () => {
    renderAuthConsumer()
    expect(screen.getByTestId('is-authenticated').textContent).toBe('false')
  })

  it('getUser reads directly from localStorage', async () => {
    renderAuthConsumer()
    // Before login: null
    expect(screen.getByTestId('get-user').textContent).toBe('null')

    const user = makeUser({ name: 'Dave' })
    localStorage.setItem('user', JSON.stringify(user))

    // Re-render to pick up the change
    await act(async () => {
      screen.getByTestId('login').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('get-user').textContent).toBe('Alice')
    })
  })
})
