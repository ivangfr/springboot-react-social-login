import { Fragment } from 'react'
import { Table, ActionIcon, TextInput } from '@mantine/core'
import { IconTrash, IconSearch } from '@tabler/icons-react'

function UserTable({ users, userUsernameSearch, handleInputChange, handleDeleteUser, handleSearchUser }) {
  let userList
  if (users.length === 0) {
    userList = (
      <Table.Tr>
        <Table.Td colSpan={6} ta='center'>No user</Table.Td>
      </Table.Tr>
    )
  } else {
    userList = users.map(user => (
      <Table.Tr key={user.id}>
        <Table.Td>
          <ActionIcon
            color='red'
            variant='filled'
            size='sm'
            disabled={user.username === 'admin'}
            onClick={() => handleDeleteUser(user.username)}
          >
            <IconTrash size={14} />
          </ActionIcon>
        </Table.Td>
        <Table.Td>{user.id}</Table.Td>
        <Table.Td>{user.username}</Table.Td>
        <Table.Td>{user.name}</Table.Td>
        <Table.Td>{user.email}</Table.Td>
        <Table.Td>{user.role}</Table.Td>
      </Table.Tr>
    ))
  }

  return (
    <Fragment>
      <form onSubmit={(e) => { e.preventDefault(); handleSearchUser() }}>
        <TextInput
          mb='md'
          name='userUsernameSearch'
          placeholder='Search by username'
          value={userUsernameSearch}
          onChange={handleInputChange}
          rightSection={
            <ActionIcon type='submit' variant='subtle' color='gray'>
              <IconSearch size={16} />
            </ActionIcon>
          }
        />
      </form>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40} />
            <Table.Th>ID</Table.Th>
            <Table.Th>Username</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{userList}</Table.Tbody>
      </Table>
    </Fragment>
  )
}

export default UserTable
