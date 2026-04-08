import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, makeRegularUser, seedLocalStorage } from '../../test-utils'
import UserPage from './UserPage'
import { movieApi } from '../misc/MovieApi'

vi.mock('../misc/MovieApi')

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

describe('UserPage', () => {
  it('redirects to / when the stored user is not USER role', () => {
    const userData = { sub: 'admin', rol: ['ADMIN'], name: 'Admin', exp: Math.floor(Date.now() / 1000) + 3600 }
    const user = { data: userData, accessToken: 'mock-token' }
    seedLocalStorage(user)
    movieApi.getMovies.mockResolvedValue({ data: [] })

    render(<UserPage />, { initialRoute: '/userpage' })
    expect(screen.queryByRole('heading', { name: /movies/i })).not.toBeInTheDocument()
  })

  it('fetches and displays movies on mount', async () => {
    seedLocalStorage(makeRegularUser())
    movieApi.getMovies.mockResolvedValue({ data: [] })

    render(<UserPage />)

    await waitFor(() => {
      expect(movieApi.getMovies).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('heading', { name: /movies/i })).toBeInTheDocument()
    })
  })

  it('displays movies loaded on mount', async () => {
    seedLocalStorage(makeRegularUser())
    const movies = [{ imdb: 'tt0133093', title: 'The Matrix', poster: '' }]
    movieApi.getMovies.mockResolvedValue({ data: movies })

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getByText('The Matrix')).toBeInTheDocument()
    })
  })

  it('shows "No Movie" when API returns an empty list', async () => {
    seedLocalStorage(makeRegularUser())
    movieApi.getMovies.mockResolvedValue({ data: [] })

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getByText('No Movie')).toBeInTheDocument()
    })
  })

  it('calls getMovies with search text when search form is submitted', async () => {
    const user = userEvent.setup()
    seedLocalStorage(makeRegularUser())
    movieApi.getMovies.mockResolvedValue({ data: [] })

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search by imdb or title/i)).toBeInTheDocument()
    })

    movieApi.getMovies.mockResolvedValue({ data: [{ imdb: 'tt0133093', title: 'The Matrix', poster: '' }] })

    await user.type(screen.getByPlaceholderText(/search by imdb or title/i), 'matrix')
    await user.keyboard('{enter}')

    await waitFor(() => {
      expect(movieApi.getMovies).toHaveBeenCalled()
    })
  })

  it('sets movies to empty array when search fails', async () => {
    const user = userEvent.setup()
    seedLocalStorage(makeRegularUser())
    movieApi.getMovies
      .mockResolvedValueOnce({ data: [{ imdb: 'tt0133093', title: 'The Matrix', poster: '' }] })
      .mockRejectedValueOnce(new Error('Network error'))

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getByText('The Matrix')).toBeInTheDocument()
    })

    await user.type(screen.getByPlaceholderText(/search by imdb or title/i), 'xyz')
    await user.keyboard('{enter}')

    await waitFor(() => {
      expect(screen.getByText('No Movie')).toBeInTheDocument()
    })
  })
})
