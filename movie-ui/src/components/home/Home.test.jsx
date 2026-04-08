import { screen, waitFor } from '@testing-library/react'
import { render } from '../../test-utils'
import Home from './Home'
import { movieApi } from '../misc/MovieApi'

vi.mock('../misc/MovieApi')

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

describe('Home', () => {
  it('renders user and movie counts after data loads', async () => {
    movieApi.numberOfUsers.mockResolvedValue({ data: 5 })
    movieApi.numberOfMovies.mockResolvedValue({ data: 12 })

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
    })

    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Movies')).toBeInTheDocument()
  })

  it('shows 0 counts when API calls fail', async () => {
    movieApi.numberOfUsers.mockRejectedValue(new Error('Network error'))
    movieApi.numberOfMovies.mockRejectedValue(new Error('Network error'))

    render(<Home />)

    await waitFor(() => {
      const zeros = screen.getAllByText('0')
      expect(zeros.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('shows the loading overlay while fetching and hides it after', async () => {
    let resolveUsers, resolveMovies
    movieApi.numberOfUsers.mockReturnValue(new Promise(r => { resolveUsers = r }))
    movieApi.numberOfMovies.mockReturnValue(new Promise(r => { resolveMovies = r }))

    const { container } = render(<Home />)

    expect(container.querySelector('.mantine-LoadingOverlay-root')).toBeInTheDocument()

    resolveUsers({ data: 5 })
    resolveMovies({ data: 12 })
    await waitFor(() => expect(container.querySelector('.mantine-LoadingOverlay-root')).not.toBeInTheDocument())

    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })
})
