import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test-utils'
import Home from './Home'
import { movieApi } from '../misc/MovieApi'

vi.mock('../misc/MovieApi', () => ({
  movieApi: {
    numberOfUsers: vi.fn(),
    numberOfMovies: vi.fn(),
  },
}))

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  it('fetches and displays the number of users and movies', async () => {
    movieApi.numberOfUsers.mockResolvedValue({ data: 42 })
    movieApi.numberOfMovies.mockResolvedValue({ data: 17 })

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument()
      expect(screen.getByText('17')).toBeInTheDocument()
    })

    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Movies')).toBeInTheDocument()
  })

  it('displays zero counts initially while loading', () => {
    // Never resolves during this check
    movieApi.numberOfUsers.mockReturnValue(new Promise(() => {}))
    movieApi.numberOfMovies.mockReturnValue(new Promise(() => {}))

    render(<Home />)

    // Initial state: counts are 0
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Movies')).toBeInTheDocument()
  })

  it('still renders the page structure when API calls fail', async () => {
    movieApi.numberOfUsers.mockRejectedValue(new Error('Network error'))
    movieApi.numberOfMovies.mockRejectedValue(new Error('Network error'))

    render(<Home />)

    await waitFor(() => {
      expect(movieApi.numberOfUsers).toHaveBeenCalled()
    })

    // Page structure should still be rendered even after error
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Movies')).toBeInTheDocument()
  })

  it('calls numberOfUsers and numberOfMovies on mount', async () => {
    movieApi.numberOfUsers.mockResolvedValue({ data: 5 })
    movieApi.numberOfMovies.mockResolvedValue({ data: 10 })

    render(<Home />)

    await waitFor(() => {
      expect(movieApi.numberOfUsers).toHaveBeenCalledTimes(1)
      expect(movieApi.numberOfMovies).toHaveBeenCalledTimes(1)
    })
  })
})
