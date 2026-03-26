import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import MovieTable from './MovieTable'

const baseProps = {
  movies: [],
  movieImdb: '',
  movieTitle: '',
  moviePoster: '',
  movieTextSearch: '',
  handleInputChange: vi.fn(),
  handleAddMovie: vi.fn(),
  handleDeleteMovie: vi.fn(),
  handleSearchMovie: vi.fn(),
}

const sampleMovies = [
  { imdb: 'tt0133093', title: 'The Matrix', poster: '', createdAt: '2024-01-01' },
  { imdb: 'tt0109830', title: 'Forrest Gump', poster: 'https://example.com/fg.jpg', createdAt: '2024-01-02' },
]

describe('MovieTable', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('empty state', () => {
    it('shows "No movie" when movies array is empty', () => {
      render(<MovieTable {...baseProps} movies={[]} />)
      expect(screen.getByText('No movie')).toBeInTheDocument()
    })

    it('does not render movie rows when movies is empty', () => {
      render(<MovieTable {...baseProps} movies={[]} />)
      expect(screen.queryByText('The Matrix')).not.toBeInTheDocument()
    })
  })

  describe('with movies', () => {
    it('renders one row per movie', () => {
      render(<MovieTable {...baseProps} movies={sampleMovies} />)
      expect(screen.getByText('The Matrix')).toBeInTheDocument()
      expect(screen.getByText('Forrest Gump')).toBeInTheDocument()
    })

    it('renders the IMDB id and createdAt for each movie', () => {
      render(<MovieTable {...baseProps} movies={sampleMovies} />)
      expect(screen.getByText('tt0133093')).toBeInTheDocument()
      expect(screen.getByText('2024-01-01')).toBeInTheDocument()
    })

    it('renders table headers', () => {
      render(<MovieTable {...baseProps} movies={sampleMovies} />)
      expect(screen.getByText('Poster')).toBeInTheDocument()
      expect(screen.getByText('IMDB')).toBeInTheDocument()
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('CreatedAt')).toBeInTheDocument()
    })
  })

  describe('delete', () => {
    it('calls handleDeleteMovie with the correct imdb when delete is clicked', async () => {
      const handleDeleteMovie = vi.fn()
      const user = userEvent.setup()
      render(<MovieTable {...baseProps} movies={sampleMovies} handleDeleteMovie={handleDeleteMovie} />)

      // Find all delete action-icon buttons in the tbody rows
      const rows = screen.getAllByRole('row')
      // rows[0] = thead, rows[1] = The Matrix, rows[2] = Forrest Gump
      const matrixRow = rows[1]
      const deleteBtn = matrixRow.querySelector('button')
      await user.click(deleteBtn)

      expect(handleDeleteMovie).toHaveBeenCalledWith('tt0133093')
    })
  })

  describe('search', () => {
    it('renders the search input', () => {
      render(<MovieTable {...baseProps} />)
      expect(screen.getByPlaceholderText(/search by imdb or title/i)).toBeInTheDocument()
    })

    it('calls handleSearchMovie when the search form is submitted', () => {
      const handleSearchMovie = vi.fn()
      render(<MovieTable {...baseProps} handleSearchMovie={handleSearchMovie} />)

      const form = screen.getByPlaceholderText(/search by imdb or title/i).closest('form')
      fireEvent.submit(form)

      expect(handleSearchMovie).toHaveBeenCalledTimes(1)
    })

    it('calls handleInputChange when user types in the search field', async () => {
      const handleInputChange = vi.fn()
      const user = userEvent.setup()
      render(<MovieTable {...baseProps} handleInputChange={handleInputChange} />)

      await user.type(screen.getByPlaceholderText(/search by imdb or title/i), 'mat')

      expect(handleInputChange).toHaveBeenCalled()
    })
  })

  describe('MovieForm integration', () => {
    it('renders the Create button (from MovieForm)', () => {
      render(<MovieTable {...baseProps} />)
      expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
    })

    it('Create button is disabled when imdb and title are empty', () => {
      render(<MovieTable {...baseProps} movieImdb='' movieTitle='' />)
      expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
    })

    it('Create button is enabled when imdb and title are provided', () => {
      render(<MovieTable {...baseProps} movieImdb='tt9999999' movieTitle='New Movie' />)
      expect(screen.getByRole('button', { name: /create/i })).not.toBeDisabled()
    })
  })
})
