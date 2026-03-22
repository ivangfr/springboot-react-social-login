import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import MovieList from './MovieList'

const baseProps = {
  isMoviesLoading: false,
  movieTextSearch: '',
  movies: [],
  handleInputChange: vi.fn(),
  handleSearchMovie: vi.fn(),
}

const sampleMovies = [
  { imdb: 'tt0133093', title: 'The Matrix', poster: 'https://example.com/matrix.jpg' },
  { imdb: 'tt0109830', title: 'Forrest Gump', poster: '' },
]

describe('MovieList', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('loading state', () => {
    it('renders skeleton cards when isMoviesLoading is true', () => {
      render(<MovieList {...baseProps} isMoviesLoading={true} />)
      // Skeleton cards — there should be 3 of them (no movie title text)
      expect(screen.queryByText('The Matrix')).not.toBeInTheDocument()
      expect(screen.queryByText('No Movie')).not.toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('shows "No Movie" when movies array is empty and not loading', () => {
      render(<MovieList {...baseProps} movies={[]} />)
      expect(screen.getByText('No Movie')).toBeInTheDocument()
    })

    it('does not render movie cards in empty state', () => {
      render(<MovieList {...baseProps} movies={[]} />)
      expect(screen.queryByText('The Matrix')).not.toBeInTheDocument()
    })
  })

  describe('with movies', () => {
    it('renders a card for each movie', () => {
      render(<MovieList {...baseProps} movies={sampleMovies} />)
      expect(screen.getByText('The Matrix')).toBeInTheDocument()
      expect(screen.getByText('Forrest Gump')).toBeInTheDocument()
    })

    it('renders the IMDB id for each movie', () => {
      render(<MovieList {...baseProps} movies={sampleMovies} />)
      expect(screen.getByText('tt0133093')).toBeInTheDocument()
      expect(screen.getByText('tt0109830')).toBeInTheDocument()
    })

    it('renders the Movies title heading', () => {
      render(<MovieList {...baseProps} movies={sampleMovies} />)
      expect(screen.getByRole('heading', { name: /movies/i })).toBeInTheDocument()
    })
  })

  describe('search', () => {
    it('renders the search input', () => {
      render(<MovieList {...baseProps} />)
      expect(screen.getByPlaceholderText(/search by imdb or title/i)).toBeInTheDocument()
    })

    it('calls handleSearchMovie when the search form is submitted', () => {
      const handleSearchMovie = vi.fn()
      render(<MovieList {...baseProps} handleSearchMovie={handleSearchMovie} />)

      const form = screen.getByPlaceholderText(/search by imdb or title/i).closest('form')
      fireEvent.submit(form)

      expect(handleSearchMovie).toHaveBeenCalledTimes(1)
    })

    it('calls handleInputChange when user types in the search field', async () => {
      const handleInputChange = vi.fn()
      const user = userEvent.setup()
      render(<MovieList {...baseProps} handleInputChange={handleInputChange} />)

      await user.type(screen.getByPlaceholderText(/search by imdb or title/i), 'mat')

      expect(handleInputChange).toHaveBeenCalled()
    })

    it('displays the current search term in the input', () => {
      render(<MovieList {...baseProps} movieTextSearch='matrix' />)
      expect(screen.getByPlaceholderText(/search by imdb or title/i)).toHaveValue('matrix')
    })
  })
})
