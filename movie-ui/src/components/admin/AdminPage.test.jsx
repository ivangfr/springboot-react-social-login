import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import AdminPage from './AdminPage'
import { movieApi } from '../misc/MovieApi'

vi.mock('../misc/MovieApi', () => ({
  movieApi: {
    getUsers: vi.fn(),
    deleteUser: vi.fn(),
    getMovies: vi.fn(),
    deleteMovie: vi.fn(),
    addMovie: vi.fn(),
  },
}))

function makeAdminUser() {
  return {
    data: { exp: Math.floor(Date.now() / 1000) + 3600, name: 'Admin', rol: ['ADMIN'] },
    accessToken: 'mock-token',
  }
}

function makeNonAdminUser() {
  return {
    data: { exp: Math.floor(Date.now() / 1000) + 3600, name: 'Regular', rol: ['USER'] },
    accessToken: 'mock-token',
  }
}

function HomePage() {
  return <div>Home Page</div>
}

function renderAdminPage(asAdmin = true) {
  const user = asAdmin ? makeAdminUser() : makeNonAdminUser()
  localStorage.setItem('user', JSON.stringify(user))

  return render(
    <Routes>
      <Route path='/adminpage' element={<AdminPage />} />
      <Route path='/' element={<HomePage />} />
    </Routes>,
    { route: '/adminpage' }
  )
}

describe('AdminPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  describe('role guard', () => {
    it('redirects to / when user is not ADMIN', () => {
      // USER role: getUser() returns a non-admin user so AdminPage can call getUser()
      movieApi.getUsers.mockResolvedValue({ data: [] })
      movieApi.getMovies.mockResolvedValue({ data: [] })

      renderAdminPage(false)

      expect(screen.getByText('Home Page')).toBeInTheDocument()
    })

    it('renders the admin content when user is ADMIN', async () => {
      movieApi.getUsers.mockResolvedValue({ data: [] })
      movieApi.getMovies.mockResolvedValue({ data: [] })

      renderAdminPage(true)

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /users/i })).toBeInTheDocument()
      })
    })
  })

  describe('data loading on mount', () => {
    it('calls getUsers and getMovies on mount', async () => {
      movieApi.getUsers.mockResolvedValue({ data: [] })
      movieApi.getMovies.mockResolvedValue({ data: [] })

      renderAdminPage()

      await waitFor(() => {
        expect(movieApi.getUsers).toHaveBeenCalledTimes(1)
        expect(movieApi.getMovies).toHaveBeenCalledTimes(1)
      })
    })

    it('displays users loaded on mount', async () => {
      const users = [{ id: 1, username: 'alice', name: 'Alice', email: 'alice@test.com', role: 'USER' }]
      movieApi.getUsers.mockResolvedValue({ data: users })
      movieApi.getMovies.mockResolvedValue({ data: [] })

      renderAdminPage()

      await waitFor(() => {
        expect(screen.getByText('alice')).toBeInTheDocument()
      })
    })

    it('displays movies loaded on mount (after switching to Movies tab)', async () => {
      const user = userEvent.setup()
      const movies = [{ imdb: 'tt0133093', title: 'The Matrix', poster: '', createdAt: '2024-01-01' }]
      movieApi.getUsers.mockResolvedValue({ data: [] })
      movieApi.getMovies.mockResolvedValue({ data: movies })

      renderAdminPage()

      await waitFor(() => {
        expect(movieApi.getMovies).toHaveBeenCalled()
      })

      await user.click(screen.getByRole('tab', { name: /movies/i }))

      await waitFor(() => {
        expect(screen.getByText('The Matrix')).toBeInTheDocument()
      })
    })
  })

  describe('delete user', () => {
    it('calls deleteUser and refreshes users list', async () => {
      const user = userEvent.setup()
      const users = [
        { id: 1, username: 'admin', name: 'Admin', email: 'admin@test.com', role: 'ADMIN' },
        { id: 2, username: 'alice', name: 'Alice', email: 'alice@test.com', role: 'USER' },
      ]
      movieApi.getUsers.mockResolvedValue({ data: users })
      movieApi.getMovies.mockResolvedValue({ data: [] })
      movieApi.deleteUser.mockResolvedValue({})

      renderAdminPage()

      await waitFor(() => {
        expect(screen.getByText('alice')).toBeInTheDocument()
      })

      const rows = screen.getAllByRole('row')
      // rows[0]=thead, rows[1]=admin, rows[2]=alice
      const aliceRow = rows[2]
      const deleteBtn = aliceRow.querySelector('button')
      await user.click(deleteBtn)

      await waitFor(() => {
        expect(movieApi.deleteUser).toHaveBeenCalledWith(
          expect.objectContaining({ accessToken: 'mock-token' }),
          'alice'
        )
      })

      // Verify getUsers is called again after delete (refresh)
      await waitFor(() => {
        expect(movieApi.getUsers).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('search user', () => {
    it('calls getUsers with search term and wraps single result in array', async () => {
      const user = userEvent.setup()
      movieApi.getUsers.mockResolvedValue({ data: [] })
      movieApi.getMovies.mockResolvedValue({ data: [] })

      renderAdminPage()

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search by username/i)).toBeInTheDocument()
      })

      // Single object response — AdminPage wraps it in an array
      const singleUser = { id: 2, username: 'alice', name: 'Alice', email: 'alice@test.com', role: 'USER' }
      movieApi.getUsers.mockResolvedValue({ data: singleUser })

      await user.type(screen.getByPlaceholderText(/search by username/i), 'alice')

      const form = screen.getByPlaceholderText(/search by username/i).closest('form')
      fireEvent.submit(form)

      await waitFor(() => {
        expect(movieApi.getUsers).toHaveBeenCalledWith(
          expect.objectContaining({ accessToken: 'mock-token' }),
          'alice'
        )
      })
    })
  })

  describe('add movie', () => {
    it('calls addMovie when Create button is clicked with valid data', async () => {
      const user = userEvent.setup()
      movieApi.getUsers.mockResolvedValue({ data: [] })
      movieApi.getMovies.mockResolvedValue({ data: [] })
      movieApi.addMovie.mockResolvedValue({})

      renderAdminPage()

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /users/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('tab', { name: /movies/i }))

      await user.type(screen.getByPlaceholderText('IMDB *'), 'tt9999999')
      await user.type(screen.getByPlaceholderText('Title *'), 'New Movie')

      await user.click(screen.getByRole('button', { name: /create/i }))

      await waitFor(() => {
        expect(movieApi.addMovie).toHaveBeenCalledWith(
          expect.objectContaining({ accessToken: 'mock-token' }),
          expect.objectContaining({ imdb: 'tt9999999', title: 'New Movie' })
        )
      })
    })
  })
})
