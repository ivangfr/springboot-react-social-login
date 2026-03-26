import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import MovieForm from './MovieForm'

function renderMovieForm(props = {}) {
  const defaults = {
    movieImdb: '',
    movieTitle: '',
    moviePoster: '',
    handleInputChange: vi.fn(),
    handleAddMovie: vi.fn(),
  }
  return render(<MovieForm {...defaults} {...props} />)
}

describe('MovieForm', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders IMDB, Title, and Poster inputs', () => {
    renderMovieForm()
    expect(screen.getByPlaceholderText(/imdb/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/poster/i)).toBeInTheDocument()
  })

  it('Create button is disabled when both imdb and title are empty', () => {
    renderMovieForm({ movieImdb: '', movieTitle: '' })
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
  })

  it('Create button is disabled when imdb is empty but title is filled', () => {
    renderMovieForm({ movieImdb: '', movieTitle: 'Some Title' })
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
  })

  it('Create button is disabled when title is empty but imdb is filled', () => {
    renderMovieForm({ movieImdb: 'tt1234567', movieTitle: '' })
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
  })

  it('Create button is disabled when imdb is whitespace only', () => {
    renderMovieForm({ movieImdb: '   ', movieTitle: 'Some Title' })
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
  })

  it('Create button is enabled when both imdb and title are provided', () => {
    renderMovieForm({ movieImdb: 'tt1234567', movieTitle: 'The Matrix' })
    expect(screen.getByRole('button', { name: /create/i })).not.toBeDisabled()
  })

  it('calls handleAddMovie when form is submitted with valid data', async () => {
    const handleAddMovie = vi.fn()
    const user = userEvent.setup()

    renderMovieForm({ movieImdb: 'tt1234567', movieTitle: 'The Matrix', handleAddMovie })

    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(handleAddMovie).toHaveBeenCalledTimes(1)
  })

  it('does not call handleAddMovie when button is disabled', async () => {
    const handleAddMovie = vi.fn()
    const user = userEvent.setup()

    renderMovieForm({ movieImdb: '', movieTitle: '', handleAddMovie })

    // Button is disabled — click should not fire the handler
    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(handleAddMovie).not.toHaveBeenCalled()
  })

  it('calls handleInputChange when user types in IMDB field', async () => {
    const handleInputChange = vi.fn()
    const user = userEvent.setup()

    renderMovieForm({ handleInputChange })

    await user.type(screen.getByPlaceholderText(/imdb/i), 'tt')

    expect(handleInputChange).toHaveBeenCalled()
  })
})
