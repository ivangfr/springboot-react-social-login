import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../test-utils'
import MovieList from './MovieList'

const sampleMovies = [
  { imdb: 'tt0133093', title: 'The Matrix', poster: 'https://example.com/matrix.jpg' },
  { imdb: 'tt0109830', title: 'Forrest Gump', poster: '' },
]

function makeProps(overrides = {}) {
  return {
    isMoviesLoading: false,
    movieTextSearch: '',
    movies: [],
    handleInputChange: vi.fn(),
    handleSearchMovie: vi.fn(),
    ...overrides,
  }
}

describe('MovieList', () => {
  it('shows skeleton cards when isMoviesLoading is true', () => {
    render(<MovieList {...makeProps({ isMoviesLoading: true })} />)
    expect(screen.queryByText('The Matrix')).not.toBeInTheDocument()
    expect(screen.queryByText('No Movie')).not.toBeInTheDocument()
  })

  it('shows "No Movie" when movies array is empty and not loading', () => {
    render(<MovieList {...makeProps({ movies: [] })} />)
    expect(screen.getByText('No Movie')).toBeInTheDocument()
  })

  it('does not render movie cards in empty state', () => {
    render(<MovieList {...makeProps({ movies: [] })} />)
    expect(screen.queryByText('The Matrix')).not.toBeInTheDocument()
  })

  it('renders a card for each movie', () => {
    render(<MovieList {...makeProps({ movies: sampleMovies })} />)
    expect(screen.getByText('The Matrix')).toBeInTheDocument()
    expect(screen.getByText('Forrest Gump')).toBeInTheDocument()
  })

  it('renders the IMDB id for each movie', () => {
    render(<MovieList {...makeProps({ movies: sampleMovies })} />)
    expect(screen.getByText('tt0133093')).toBeInTheDocument()
    expect(screen.getByText('tt0109830')).toBeInTheDocument()
  })

  it('renders the Movies title heading', () => {
    render(<MovieList {...makeProps({ movies: sampleMovies })} />)
    expect(screen.getByRole('heading', { name: /movies/i })).toBeInTheDocument()
  })

  it('renders the search input', () => {
    render(<MovieList {...makeProps()} />)
    expect(screen.getByPlaceholderText(/search by imdb or title/i)).toBeInTheDocument()
  })

  it('calls handleSearchMovie when the search form is submitted', () => {
    const handleSearchMovie = vi.fn()
    render(<MovieList {...makeProps({ handleSearchMovie })} />)

    const form = screen.getByPlaceholderText(/search by imdb or title/i).closest('form')
    fireEvent.submit(form)

    expect(handleSearchMovie).toHaveBeenCalledTimes(1)
  })

  it('calls handleInputChange when user types in the search field', () => {
    const handleInputChange = vi.fn()
    render(<MovieList {...makeProps({ handleInputChange })} />)

    fireEvent.change(screen.getByPlaceholderText(/search by imdb or title/i), { target: { value: 'mat' } })

    expect(handleInputChange).toHaveBeenCalled()
  })

  it('displays the current search term in the input', () => {
    render(<MovieList {...makeProps({ movieTextSearch: 'matrix' })} />)
    expect(screen.getByPlaceholderText(/search by imdb or title/i)).toHaveValue('matrix')
  })
})
