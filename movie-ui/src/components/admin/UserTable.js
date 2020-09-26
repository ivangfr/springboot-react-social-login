import React, { Fragment } from 'react'
import { Form, Button, Input, Table } from 'semantic-ui-react'

function UserTable({ users, userUsernameSearch, handleInputChange, handleDeleteUser, handleSearchUser }) {
  let userList
  if (users.length === 0) {
    userList = (
      <Table.Row key='no-user'>
        <Table.Cell collapsing textAlign='center' colSpan='6'>No user</Table.Cell>
      </Table.Row>
    )
  } else {
    userList = users.map(user => {
      return (
        <Table.Row key={user.id}>
          <Table.Cell collapsing>
            <Button
              circular
              color='red'
              size='small'
              icon='trash'
              disabled={user.username === 'admin'}
              onClick={() => handleDeleteUser(user.username)}
            />
          </Table.Cell>
          <Table.Cell>{user.id}</Table.Cell>
          <Table.Cell>{user.username}</Table.Cell>
          <Table.Cell>{user.name}</Table.Cell>
          <Table.Cell>{user.email}</Table.Cell>
          <Table.Cell>{user.role}</Table.Cell>
        </Table.Row>
      )
    })
  }

  return (
    <Fragment>
      <Form onSubmit={handleSearchUser}>
        <Input
          action={{ icon: 'search' }}
          name='userUsernameSearch'
          placeholder='Search by username'
          value={userUsernameSearch}
          onChange={handleInputChange}
        />
      </Form>
      <Table compact striped selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1} />
            <Table.HeaderCell width={1}>ID</Table.HeaderCell>
            <Table.HeaderCell width={3}>Username</Table.HeaderCell>
            <Table.HeaderCell width={4}>Name</Table.HeaderCell>
            <Table.HeaderCell width={5}>Email</Table.HeaderCell>
            <Table.HeaderCell width={2}>Role</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {userList}
        </Table.Body>
      </Table>
    </Fragment>
  )
}

export default UserTable