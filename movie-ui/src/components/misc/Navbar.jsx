import { Link } from 'react-router-dom'
import { AppShell, Group, Button, Anchor, Text } from '@mantine/core'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { getUser, userIsAuthenticated, userLogout } = useAuth()

  const isAuthenticated = userIsAuthenticated()
  const user = getUser()
  const isAdmin = user && user.data.rol[0] === 'ADMIN'
  const isUser = user && user.data.rol[0] === 'USER'
  const userName = user ? user.data.name : ''

  const logout = () => { userLogout() }

  return (
    <AppShell.Header
      style={{ backgroundColor: 'var(--mantine-color-grape-7)', display: 'flex', alignItems: 'center', padding: '0 16px' }}
    >
      <Group justify='space-between' style={{ width: '100%' }}>
        <Group gap='md'>
          <Text fw={700} c='white' size='lg'>Movie-UI</Text>
          <Anchor component={Link} to='/' c='white' underline='never'>Home</Anchor>
          {isAdmin && (
            <Anchor component={Link} to='/adminpage' c='white' underline='never'>AdminPage</Anchor>
          )}
          {isUser && (
            <Anchor component={Link} to='/userpage' c='white' underline='never'>UserPage</Anchor>
          )}
        </Group>
        <Group gap='sm'>
          {!isAuthenticated && (
            <>
              <Button component={Link} to='/login' variant='white' color='grape' size='sm'>Login</Button>
              <Button component={Link} to='/signup' variant='outline' color='white' size='sm'>Sign Up</Button>
            </>
          )}
          {isAuthenticated && (
            <>
              <Text c='white' size='sm'>{`Hi ${userName}`}</Text>
              <Button component={Link} to='/' variant='white' color='grape' size='sm' onClick={logout}>Logout</Button>
            </>
          )}
        </Group>
      </Group>
    </AppShell.Header>
  )
}

export default Navbar
