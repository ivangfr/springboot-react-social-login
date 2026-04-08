import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../test-utils'
import MovieTable from './MovieTable'

const sampleMovies = [
  { imdb: 'tt0133093', title: 'The Matrix', poster: '', createdAt: '2024-01-01' },
  { imdb: 'tt0109830', title: 'Forrest Gump', poster: 'https://example.com/fg.jpg', createdAt: '2024-01-02' },
]

function makeProps(overrides = {}) {
  return {
    movies: [],
    movieImdb: '',
    movieTitle: '',
    moviePoster: '',
    movieTextSearch: '',
    handleInputChange: vi.fn(),
    handleAddMovie: vi.fn(),
    handleDeleteMovie: vi.fn(),
    handleSearchMovie: vi.fn(),
    ...overrides,
  }
}

describe('MovieTable', () => {
  it('shows "No movie" when movies array is empty', () => {
    render(<MovieTable {...makeProps({ movies: [] })} />)
    expect(screen.getByText('No movie')).toBeInTheDocument()
  })

  it('does not render movie rows when movies is empty', () => {
    render(<MovieTable {...makeProps({ movies: [] })} />)
    expect(screen.queryByText('The Matrix')).not.toBeInTheDocument()
  })

  it('renders one row per movie', () => {
    render(<MovieTable {...makeProps({ movies: sampleMovies })} />)
    expect(screen.getByText('The Matrix')).toBeInTheDocument()
    expect(screen.getByText('Forrest Gump')).toBeInTheDocument()
  })

  it('renders the IMDB id and createdAt for each movie', () => {
    render(<MovieTable {...makeProps({ movies: sampleMovies })} />)
    expect(screen.getByText('tt0133093')).toBeInTheDocument()
    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
  })

  it('renders table headers', () => {
    render(<MovieTable {...makeProps({ movies: sampleMovies })} />)
    expect(screen.getByText('Poster')).toBeInTheDocument()
    expect(screen.getByText('IMDB')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('CreatedAt')).toBeInTheDocument()
  })

  it('calls handleDeleteMovie with the correct imdb when delete is clicked', () => {
    const handleDeleteMovie = vi.fn()
    render(<MovieTable {...makeProps({ movies: sampleMovies, handleDeleteMovie })} />)

    const rows = screen.getAllByRole('row')
    const matrixRow = rows[1]
    const deleteBtn = matrixRow.querySelector('button')
    deleteBtn.click()

    expect(handleDeleteMovie).toHaveBeenCalledWith('tt0133093')
  })

  it('renders the search input', () => {
    render(<MovieTable {...makeProps()} />)
    expect(screen.getByPlaceholderText(/search by imdb or title/i)).toBeInTheDocument()
  })

  it('calls handleSearchMovie when the search form is submitted', () => {
    const handleSearchMovie = vi.fn()
    render(<MovieTable {...makeProps({ handleSearchMovie })} />)

    const form = screen.getByPlaceholderText(/search by imdb or title/i).closest('form')
    fireEvent.submit(form)

    expect(handleSearchMovie).toHaveBeenCalledTimes(1)
  })

  it('calls handleInputChange when user types in the search field', () => {
    const handleInputChange = vi.fn()
    render(<MovieTable {...makeProps({ handleInputChange })} />)

    fireEvent.change(screen.getByPlaceholderText(/search by imdb or title/i), { target: { value: 'mat' } })

    expect(handleInputChange).toHaveBeenCalled()
  })

  it('renders the Create button (from MovieForm)', () => {
    render(<MovieTable {...makeProps()} />)
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })

  it('Create button is disabled when imdb and title are empty', () => {
    render(<MovieTable {...makeProps({ movieImdb: '', movieTitle: '' })} />)
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
  })

  it('Create button is enabled when imdb and title are provided', () => {
    render(<MovieTable {...makeProps({ movieImdb: 'tt9999999', movieTitle: 'New Movie' })} />)
    expect(screen.getByRole('button', { name: /create/i })).not.toBeDisabled()
  })
})
