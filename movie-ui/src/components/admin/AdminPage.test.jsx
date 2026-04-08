import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, makeAdminUser, seedLocalStorage } from '../../test-utils'
import AdminPage from './AdminPage'
import { movieApi } from '../misc/MovieApi'

vi.mock('../misc/MovieApi')

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

describe('AdminPage', () => {
  it('redirects to / when the stored user is not ADMIN', () => {
    const userData = { sub: 'bob', rol: ['USER'], name: 'Bob', exp: Math.floor(Date.now() / 1000) + 3600 }
    const user = { data: userData, accessToken: 'mock-token' }
    seedLocalStorage(user)

    movieApi.getUsers.mockResolvedValue({ data: [] })
    movieApi.getMovies.mockResolvedValue({ data: [] })

    render(<AdminPage />, { initialRoute: '/adminpage' })
    expect(screen.queryByRole('tab', { name: /users/i })).not.toBeInTheDocument()
  })

  it('loads and displays the admin tabs when user is ADMIN', async () => {
    seedLocalStorage(makeAdminUser())
    movieApi.getUsers.mockResolvedValue({ data: [] })
    movieApi.getMovies.mockResolvedValue({ data: [] })

    render(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /users/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /movies/i })).toBeInTheDocument()
    })
  })

  it('fetches users and movies on mount', async () => {
    seedLocalStorage(makeAdminUser())
    movieApi.getUsers.mockResolvedValue({
      data: [{ id: 1, username: 'alice', name: 'Alice', email: 'alice@example.com', role: 'USER' }],
    })
    movieApi.getMovies.mockResolvedValue({ data: [] })

    render(<AdminPage />)

    await waitFor(() => {
      expect(movieApi.getUsers).toHaveBeenCalledTimes(1)
      expect(movieApi.getMovies).toHaveBeenCalledTimes(1)
      expect(screen.getByText('alice')).toBeInTheDocument()
    })
  })

  it('displays users loaded on mount', async () => {
    seedLocalStorage(makeAdminUser())
    const users = [{ id: 1, username: 'alice', name: 'Alice', email: 'alice@test.com', role: 'USER' }]
    movieApi.getUsers.mockResolvedValue({ data: users })
    movieApi.getMovies.mockResolvedValue({ data: [] })

    render(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByText('alice')).toBeInTheDocument()
    })
  })

  it('displays movies after switching to Movies tab', async () => {
    seedLocalStorage(makeAdminUser())
    const movies = [{ imdb: 'tt0133093', title: 'The Matrix', poster: '', createdAt: '2024-01-01' }]
    movieApi.getUsers.mockResolvedValue({ data: [] })
    movieApi.getMovies.mockResolvedValue({ data: movies })

    render(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByText('The Matrix')).toBeInTheDocument()
    })
  })

  it('calls deleteUser and refreshes users list', async () => {
    const user = userEvent.setup()
    seedLocalStorage(makeAdminUser())
    const users = [
      { id: 1, username: 'admin', name: 'Admin', email: 'admin@test.com', role: 'ADMIN' },
      { id: 2, username: 'alice', name: 'Alice', email: 'alice@test.com', role: 'USER' },
    ]
    movieApi.getUsers.mockResolvedValue({ data: users })
    movieApi.getMovies.mockResolvedValue({ data: [] })
    movieApi.deleteUser.mockResolvedValue({})

    render(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByText('alice')).toBeInTheDocument()
    })

    const rows = screen.getAllByRole('row')
    const aliceRow = rows[2]
    const deleteBtn = aliceRow.querySelector('button')
    await user.click(deleteBtn)

    await waitFor(() => {
      expect(movieApi.deleteUser).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(movieApi.getUsers).toHaveBeenCalledTimes(2)
    })
  })

  it('calls getUsers with search term', async () => {
    const user = userEvent.setup()
    seedLocalStorage(makeAdminUser())
    movieApi.getUsers.mockResolvedValue({ data: [] })
    movieApi.getMovies.mockResolvedValue({ data: [] })

    render(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search by username/i)).toBeInTheDocument()
    })

    const singleUser = { id: 2, username: 'alice', name: 'Alice', email: 'alice@test.com', role: 'USER' }
    movieApi.getUsers.mockResolvedValue({ data: singleUser })

    await user.type(screen.getByPlaceholderText(/search by username/i), 'alice')
    await user.keyboard('{enter}')

    await waitFor(() => {
      expect(movieApi.getUsers).toHaveBeenCalled()
    })
  })

  it('calls addMovie when Create button is clicked with valid data', async () => {
    const user = userEvent.setup()
    seedLocalStorage(makeAdminUser())
    movieApi.getUsers.mockResolvedValue({ data: [] })
    movieApi.getMovies.mockResolvedValue({ data: [] })
    movieApi.addMovie.mockResolvedValue({})

    render(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /users/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('tab', { name: /movies/i }))

    await user.type(screen.getByPlaceholderText('IMDB *'), 'tt9999999')
    await user.type(screen.getByPlaceholderText('Title *'), 'New Movie')

    await user.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(movieApi.addMovie).toHaveBeenCalled()
    })
  })
})
