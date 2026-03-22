import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import UserTable from './UserTable'

const baseProps = {
  users: [],
  userUsernameSearch: '',
  handleInputChange: vi.fn(),
  handleDeleteUser: vi.fn(),
  handleSearchUser: vi.fn(),
}

const sampleUsers = [
  { id: 1, username: 'admin', name: 'Administrator', email: 'admin@example.com', role: 'ADMIN' },
  { id: 2, username: 'alice', name: 'Alice Smith', email: 'alice@example.com', role: 'USER' },
  { id: 3, username: 'bob', name: 'Bob Jones', email: 'bob@example.com', role: 'USER' },
]

describe('UserTable', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('empty state', () => {
    it('shows "No user" when users array is empty', () => {
      render(<UserTable {...baseProps} users={[]} />)
      expect(screen.getByText('No user')).toBeInTheDocument()
    })

    it('does not render any data rows when users is empty', () => {
      render(<UserTable {...baseProps} users={[]} />)
      expect(screen.queryByText('alice')).not.toBeInTheDocument()
    })
  })

  describe('with users', () => {
    it('renders one row per user', () => {
      render(<UserTable {...baseProps} users={sampleUsers} />)
      expect(screen.getByText('alice')).toBeInTheDocument()
      expect(screen.getByText('bob')).toBeInTheDocument()
      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    it('renders user details: name, email, role', () => {
      render(<UserTable {...baseProps} users={sampleUsers} />)
      expect(screen.getByText('Alice Smith')).toBeInTheDocument()
      expect(screen.getByText('alice@example.com')).toBeInTheDocument()
      expect(screen.getAllByText('USER').length).toBeGreaterThan(0)
    })

    it('renders table headers', () => {
      render(<UserTable {...baseProps} users={sampleUsers} />)
      expect(screen.getByText('ID')).toBeInTheDocument()
      expect(screen.getByText('Username')).toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Role')).toBeInTheDocument()
    })
  })

  describe('delete button', () => {
    it('delete button is disabled for the admin user', () => {
      render(<UserTable {...baseProps} users={sampleUsers} />)
      // There are 3 delete buttons. The admin row's button should be disabled.
      // We identify by iterating: admin is first user.
      const rows = screen.getAllByRole('row')
      // rows[0] = thead row, rows[1] = admin row, rows[2] = alice row, rows[3] = bob row
      const adminRow = rows[1]
      const deleteBtn = adminRow.querySelector('button')
      expect(deleteBtn).toBeDisabled()
    })

    it('delete button is enabled for non-admin users', () => {
      render(<UserTable {...baseProps} users={sampleUsers} />)
      const rows = screen.getAllByRole('row')
      const aliceRow = rows[2]
      const deleteBtn = aliceRow.querySelector('button')
      expect(deleteBtn).not.toBeDisabled()
    })

    it('calls handleDeleteUser with the correct username when delete is clicked', async () => {
      const handleDeleteUser = vi.fn()
      const user = userEvent.setup()
      render(<UserTable {...baseProps} users={sampleUsers} handleDeleteUser={handleDeleteUser} />)

      const rows = screen.getAllByRole('row')
      const aliceRow = rows[2]
      const deleteBtn = aliceRow.querySelector('button')
      await user.click(deleteBtn)

      expect(handleDeleteUser).toHaveBeenCalledWith('alice')
    })
  })

  describe('search', () => {
    it('renders the search input', () => {
      render(<UserTable {...baseProps} />)
      expect(screen.getByPlaceholderText(/search by username/i)).toBeInTheDocument()
    })

    it('calls handleSearchUser when the search form is submitted', async () => {
      const handleSearchUser = vi.fn()
      render(<UserTable {...baseProps} handleSearchUser={handleSearchUser} />)

      const form = screen.getByPlaceholderText(/search by username/i).closest('form')
      fireEvent.submit(form)

      expect(handleSearchUser).toHaveBeenCalledTimes(1)
    })

    it('calls handleInputChange when user types in the search field', async () => {
      const handleInputChange = vi.fn()
      const user = userEvent.setup()
      render(<UserTable {...baseProps} handleInputChange={handleInputChange} />)

      await user.type(screen.getByPlaceholderText(/search by username/i), 'ali')

      expect(handleInputChange).toHaveBeenCalled()
    })
  })
})
