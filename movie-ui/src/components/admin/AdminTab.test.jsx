import { screen } from '@testing-library/react'
import { render } from '../../test-utils'
import AdminTab from './AdminTab'

function makeProps(overrides = {}) {
  return {
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
    ...overrides,
  }
}

describe('AdminTab', () => {
  it('renders Users and Movies tab labels', () => {
    render(<AdminTab {...makeProps()} />)
    expect(screen.getByRole('tab', { name: /users/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /movies/i })).toBeInTheDocument()
  })

  it('shows the Users tab panel by default', () => {
    render(<AdminTab {...makeProps()} />)
    expect(screen.getByPlaceholderText(/search by username/i)).toBeInTheDocument()
  })

  it('shows "No user" in the Users panel by default when users array is empty', () => {
    render(<AdminTab {...makeProps({ users: [] })} />)
    expect(screen.getByText('No user')).toBeInTheDocument()
  })

  it('shows user rows in the Users panel when users are provided', () => {
    const users = [{ id: 1, username: 'alice', name: 'Alice', email: 'alice@example.com', role: 'USER' }]
    render(<AdminTab {...makeProps({ users })} />)
    expect(screen.getByText('alice')).toBeInTheDocument()
  })

  it('switches to the Movies tab panel when Movies tab is clicked', () => {
    render(<AdminTab {...makeProps()} />)
    screen.getByRole('tab', { name: /movies/i }).click()
    expect(screen.getByPlaceholderText(/search by imdb or title/i)).toBeInTheDocument()
  })

  it('shows "No movie" in the Movies panel when movies array is empty', () => {
    render(<AdminTab {...makeProps({ movies: [] })} />)
    screen.getByRole('tab', { name: /movies/i }).click()
    expect(screen.getByText('No movie')).toBeInTheDocument()
  })

  it('shows movie rows in the Movies panel when movies are provided', () => {
    const movies = [{ imdb: 'tt0133093', title: 'The Matrix', poster: '', createdAt: '2024-01-01' }]
    render(<AdminTab {...makeProps({ movies })} />)
    screen.getByRole('tab', { name: /movies/i }).click()
    expect(screen.getByText('The Matrix')).toBeInTheDocument()
  })
})
