import React, { Fragment } from 'react'
import { Form, Button, Input, Table } from 'semantic-ui-react'

function UserTable({ users, userUsernameSearch, handleChange, deleteUser, searchUser }) {
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
              onClick={() => deleteUser(user.username)}
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
      <Form onSubmit={searchUser}>
        <Input
          action={{ icon: 'search' }}
          id='userUsernameSearch'
          placeholder='Search by username'
          value={userUsernameSearch}
          onChange={handleChange}
        />
      </Form>
      <Table compact striped selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>id</Table.HeaderCell>
            <Table.HeaderCell>username</Table.HeaderCell>
            <Table.HeaderCell>name</Table.HeaderCell>
            <Table.HeaderCell>email</Table.HeaderCell>
            <Table.HeaderCell>role</Table.HeaderCell>
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