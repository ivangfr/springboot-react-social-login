import { render } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from './components/context/AuthContext'

export function makeToken(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const body = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${header}.${body}.fakesig`
}

const futureExp = () => Math.floor(Date.now() / 1000) + 3600
const expiredExp = () => Math.floor(Date.now() / 1000) - 3600

export function makeAdminUser() {
  const data = { sub: 'admin', rol: ['ADMIN'], name: 'Admin User', exp: futureExp() }
  return { data, accessToken: makeToken(data) }
}

export function makeRegularUser() {
  const data = { sub: 'bob', rol: ['USER'], name: 'Bob', exp: futureExp() }
  return { data, accessToken: makeToken(data) }
}

export function makeExpiredUser() {
  const data = { sub: 'bob', rol: ['USER'], name: 'Bob', exp: expiredExp() }
  return { data, accessToken: makeToken(data) }
}

export function seedLocalStorage(user) {
  localStorage.setItem('user', JSON.stringify(user))
}

function renderWithProviders(ui, { route, initialRoute, ...options } = {}) {
  const initial = initialRoute ?? route ?? '/'
  function Wrapper({ children }) {
    return (
      <MantineProvider>
        <MemoryRouter initialEntries={[initial]} {...options}>
          <AuthProvider>{children}</AuthProvider>
        </MemoryRouter>
      </MantineProvider>
    )
  }
  return render(ui, { wrapper: Wrapper })
}

export * from '@testing-library/react'
export { renderWithProviders as render }
