import { render } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from './components/context/AuthContext'

function renderWithProviders(ui, { route = '/', memoryRouterProps = {} } = {}) {
  return render(
    <MantineProvider>
      <MemoryRouter initialEntries={[route]} {...memoryRouterProps}>
        <AuthProvider>{ui}</AuthProvider>
      </MemoryRouter>
    </MantineProvider>
  )
}

export * from '@testing-library/react'
export { renderWithProviders as render }
