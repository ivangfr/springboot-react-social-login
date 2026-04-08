import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import MovieForm from './MovieForm'

function makeProps(overrides = {}) {
  return {
    movieImdb: '',
    movieTitle: '',
    moviePoster: '',
    handleInputChange: vi.fn(),
    handleAddMovie: vi.fn(),
    ...overrides,
  }
}

describe('MovieForm', () => {
  it('renders IMDB, Title, and Poster inputs', () => {
    render(<MovieForm {...makeProps()} />)
    expect(screen.getByPlaceholderText(/imdb/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/poster/i)).toBeInTheDocument()
  })

  it('disables Create button when both imdb and title are empty', () => {
    render(<MovieForm {...makeProps({ movieImdb: '', movieTitle: '' })} />)
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
  })

  it('disables Create button when imdb is empty but title is filled', () => {
    render(<MovieForm {...makeProps({ movieImdb: '', movieTitle: 'Some Title' })} />)
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
  })

  it('disables Create button when title is empty but imdb is filled', () => {
    render(<MovieForm {...makeProps({ movieImdb: 'tt1234567', movieTitle: '' })} />)
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
  })

  it('disables Create button when imdb is whitespace only', () => {
    render(<MovieForm {...makeProps({ movieImdb: '   ', movieTitle: 'Some Title' })} />)
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
  })

  it('enables Create button when both imdb and title are provided', () => {
    render(<MovieForm {...makeProps({ movieImdb: 'tt1234567', movieTitle: 'The Matrix' })} />)
    expect(screen.getByRole('button', { name: /create/i })).not.toBeDisabled()
  })

  it('calls handleAddMovie when form is submitted with valid data', () => {
    const handleAddMovie = vi.fn()
    render(<MovieForm {...makeProps({ movieImdb: 'tt1234567', movieTitle: 'The Matrix', handleAddMovie })} />)
    fireEvent.submit(screen.getByRole('button', { name: /create/i }).closest('form'))
    expect(handleAddMovie).toHaveBeenCalledTimes(1)
  })

  it('does not call handleAddMovie when button is disabled', async () => {
    const handleAddMovie = vi.fn()
    const user = userEvent.setup()
    render(<MovieForm {...makeProps({ movieImdb: '', movieTitle: '', handleAddMovie })} />)
    await user.click(screen.getByRole('button', { name: /create/i }))
    expect(handleAddMovie).not.toHaveBeenCalled()
  })

  it('calls handleInputChange when user types in IMDB field', () => {
    const handleInputChange = vi.fn()
    render(<MovieForm {...makeProps({ handleInputChange })} />)
    fireEvent.change(screen.getByPlaceholderText(/imdb/i), { target: { value: 'tt' } })
    expect(handleInputChange).toHaveBeenCalledTimes(1)
  })
})
