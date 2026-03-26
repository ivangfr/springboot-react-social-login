import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import AdminTab from './AdminTab'

const baseProps = {
  isUsersLoading: false,
  users: [],
  userUsernameSearch: '',
  handleDeleteUser: vi.fn(),
  handleSearchUser: vi.fn(),
  isMoviesLoading: false,
  movies: [],
  movieImdb: '',
  movieTitle: '',
  moviePoster: '',
  movieTextSearch: '',
  handleAddMovie: vi.fn(),
  handleDeleteMovie: vi.fn(),
  handleSearchMovie: vi.fn(),
  handleInputChange: vi.fn(),
}

describe('AdminTab', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders Users and Movies tab labels', () => {
    render(<AdminTab {...baseProps} />)
    expect(screen.getByRole('tab', { name: /users/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /movies/i })).toBeInTheDocument()
  })

  it('shows the Users tab panel by default', () => {
    render(<AdminTab {...baseProps} />)
    // The UserTable renders a search input with placeholder "Search by username"
    expect(screen.getByPlaceholderText(/search by username/i)).toBeInTheDocument()
  })

  it('shows "No user" in the Users panel by default when users array is empty', () => {
    render(<AdminTab {...baseProps} users={[]} />)
    expect(screen.getByText('No user')).toBeInTheDocument()
  })

  it('shows user rows in the Users panel when users are provided', () => {
    const users = [
      { id: 1, username: 'alice', name: 'Alice', email: 'alice@example.com', role: 'USER' },
    ]
    render(<AdminTab {...baseProps} users={users} />)
    expect(screen.getByText('alice')).toBeInTheDocument()
  })

  it('switches to the Movies tab panel when Movies tab is clicked', async () => {
    const user = userEvent.setup()
    render(<AdminTab {...baseProps} />)

    await user.click(screen.getByRole('tab', { name: /movies/i }))

    // MovieTable renders a "Search by Imdb or Title" input
    expect(screen.getByPlaceholderText(/search by imdb or title/i)).toBeInTheDocument()
  })

  it('shows "No movie" in the Movies panel when movies array is empty', async () => {
    const user = userEvent.setup()
    render(<AdminTab {...baseProps} movies={[]} />)

    await user.click(screen.getByRole('tab', { name: /movies/i }))

    expect(screen.getByText('No movie')).toBeInTheDocument()
  })

  it('shows movie rows in the Movies panel when movies are provided', async () => {
    const user = userEvent.setup()
    const movies = [
      { imdb: 'tt0133093', title: 'The Matrix', poster: '', createdAt: '2024-01-01' },
    ]
    render(<AdminTab {...baseProps} movies={movies} />)

    await user.click(screen.getByRole('tab', { name: /movies/i }))

    expect(screen.getByText('The Matrix')).toBeInTheDocument()
  })
})
