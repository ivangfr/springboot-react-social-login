import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import UserPage from './UserPage'
import { movieApi } from '../misc/MovieApi'

vi.mock('../misc/MovieApi', () => ({
  movieApi: {
    getMovies: vi.fn(),
  },
}))

function makeUserUser() {
  return {
    data: { exp: Math.floor(Date.now() / 1000) + 3600, name: 'Alice', rol: ['USER'] },
    accessToken: 'mock-token',
  }
}

function makeAdminUser() {
  return {
    data: { exp: Math.floor(Date.now() / 1000) + 3600, name: 'Admin', rol: ['ADMIN'] },
    accessToken: 'mock-token',
  }
}

function HomePage() {
  return <div>Home Page</div>
}

function renderUserPage(asUser = true) {
  const user = asUser ? makeUserUser() : makeAdminUser()
  localStorage.setItem('user', JSON.stringify(user))

  return render(
    <Routes>
      <Route path='/userpage' element={<UserPage />} />
      <Route path='/' element={<HomePage />} />
    </Routes>,
    { route: '/userpage' }
  )
}

describe('UserPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  describe('role guard', () => {
    it('redirects to / when user role is not USER', () => {
      movieApi.getMovies.mockResolvedValue({ data: [] })

      renderUserPage(false)

      expect(screen.getByText('Home Page')).toBeInTheDocument()
    })

    it('renders the page when user role is USER', async () => {
      movieApi.getMovies.mockResolvedValue({ data: [] })

      renderUserPage(true)

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /movies/i })).toBeInTheDocument()
      })
    })
  })

  describe('data loading on mount', () => {
    it('calls getMovies on mount', async () => {
      movieApi.getMovies.mockResolvedValue({ data: [] })

      renderUserPage()

      await waitFor(() => {
        expect(movieApi.getMovies).toHaveBeenCalledTimes(1)
      })
    })

    it('displays movies loaded on mount', async () => {
      const movies = [
        { imdb: 'tt0133093', title: 'The Matrix', poster: '' },
      ]
      movieApi.getMovies.mockResolvedValue({ data: movies })

      renderUserPage()

      await waitFor(() => {
        expect(screen.getByText('The Matrix')).toBeInTheDocument()
      })
    })

    it('shows "No Movie" when API returns an empty list', async () => {
      movieApi.getMovies.mockResolvedValue({ data: [] })

      renderUserPage()

      await waitFor(() => {
        expect(screen.getByText('No Movie')).toBeInTheDocument()
      })
    })
  })

  describe('search', () => {
    it('calls getMovies with search text when search form is submitted', async () => {
      const user = userEvent.setup()
      movieApi.getMovies.mockResolvedValue({ data: [] })

      renderUserPage()

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search by imdb or title/i)).toBeInTheDocument()
      })

      movieApi.getMovies.mockResolvedValue({ data: [{ imdb: 'tt0133093', title: 'The Matrix', poster: '' }] })

      await user.type(screen.getByPlaceholderText(/search by imdb or title/i), 'matrix')

      const form = screen.getByPlaceholderText(/search by imdb or title/i).closest('form')
      fireEvent.submit(form)

      await waitFor(() => {
        expect(movieApi.getMovies).toHaveBeenCalledWith(
          expect.objectContaining({ accessToken: 'mock-token' }),
          'matrix'
        )
      })
    })

    it('sets movies to empty array when search fails', async () => {
      movieApi.getMovies
        .mockResolvedValueOnce({ data: [{ imdb: 'tt0133093', title: 'The Matrix', poster: '' }] })
        .mockRejectedValueOnce(new Error('Network error'))

      const user = userEvent.setup()
      renderUserPage()

      await waitFor(() => {
        expect(screen.getByText('The Matrix')).toBeInTheDocument()
      })

      await user.type(screen.getByPlaceholderText(/search by imdb or title/i), 'xyz')
      const form = screen.getByPlaceholderText(/search by imdb or title/i).closest('form')
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('No Movie')).toBeInTheDocument()
      })
    })
  })
})
