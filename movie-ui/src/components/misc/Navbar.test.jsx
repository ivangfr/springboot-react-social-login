import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../test-utils'
import { AppShell } from '@mantine/core'
import Navbar from './Navbar'

function makeUser({ role = 'USER', name = 'Test User', exp = Math.floor(Date.now() / 1000) + 3600 } = {}) {
  return {
    data: { exp, name, rol: [role] },
    accessToken: 'mock-token',
  }
}

// Navbar uses AppShell.Header which requires an AppShell ancestor
function renderNavbar() {
  return render(
    <AppShell header={{ height: 60 }}>
      <Navbar />
    </AppShell>
  )
}

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  describe('unauthenticated state', () => {
    it('shows Login and Sign Up buttons', () => {
      renderNavbar()
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
    })

    it('shows Home link and Movie-UI brand', () => {
      renderNavbar()
      expect(screen.getByText('Movie-UI')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    })

    it('does not show AdminPage or UserPage links', () => {
      renderNavbar()
      expect(screen.queryByRole('link', { name: /adminpage/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /userpage/i })).not.toBeInTheDocument()
    })

    it('does not show greeting or Logout button', () => {
      renderNavbar()
      expect(screen.queryByText(/hi /i)).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /logout/i })).not.toBeInTheDocument()
    })
  })

  describe('authenticated as ADMIN', () => {
    beforeEach(() => {
      localStorage.setItem('user', JSON.stringify(makeUser({ role: 'ADMIN', name: 'Admin User' })))
    })

    it('shows AdminPage link', () => {
      renderNavbar()
      expect(screen.getByRole('link', { name: /adminpage/i })).toBeInTheDocument()
    })

    it('does not show UserPage link', () => {
      renderNavbar()
      expect(screen.queryByRole('link', { name: /userpage/i })).not.toBeInTheDocument()
    })

    it('shows greeting with the user name', () => {
      renderNavbar()
      expect(screen.getByText('Hi Admin User')).toBeInTheDocument()
    })

    it('shows Logout button and hides Login/Sign Up', () => {
      renderNavbar()
      expect(screen.getByRole('link', { name: /logout/i })).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /sign up/i })).not.toBeInTheDocument()
    })
  })

  describe('authenticated as USER', () => {
    beforeEach(() => {
      localStorage.setItem('user', JSON.stringify(makeUser({ role: 'USER', name: 'Regular User' })))
    })

    it('shows UserPage link', () => {
      renderNavbar()
      expect(screen.getByRole('link', { name: /userpage/i })).toBeInTheDocument()
    })

    it('does not show AdminPage link', () => {
      renderNavbar()
      expect(screen.queryByRole('link', { name: /adminpage/i })).not.toBeInTheDocument()
    })

    it('shows greeting with the user name', () => {
      renderNavbar()
      expect(screen.getByText('Hi Regular User')).toBeInTheDocument()
    })
  })

  describe('Logout behaviour', () => {
    it('clicking Logout removes user from localStorage', () => {
      localStorage.setItem('user', JSON.stringify(makeUser({ name: 'Admin User', role: 'ADMIN' })))
      renderNavbar()

      const logoutBtn = screen.getByRole('link', { name: /logout/i })
      fireEvent.click(logoutBtn)

      expect(localStorage.getItem('user')).toBeNull()
    })
  })
})
