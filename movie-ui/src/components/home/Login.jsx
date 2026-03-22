import { useState } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import { Button, TextInput, PasswordInput, Paper, Stack, Alert, Divider, Anchor, Center, Box } from '@mantine/core'
import { IconBrandGithubFilled, IconBrandGoogleFilled, IconBrandFacebookFilled, IconBrandInstagramFilled } from '@tabler/icons-react'
import { useAuth } from '../context/AuthContext'
import { movieApi } from '../misc/MovieApi'
import { parseJwt, getSocialLoginUrl, handleLogError } from '../misc/Helpers'

function Login() {
  const Auth = useAuth()
  const isLoggedIn = Auth.userIsAuthenticated()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!(username && password)) {
      setIsError(true)
      return
    }

    try {
      const response = await movieApi.authenticate(username, password)
      const { accessToken } = response.data
      const data = parseJwt(accessToken)
      const authenticatedUser = { data, accessToken }

      Auth.userLogin(authenticatedUser)

      setUsername('')
      setPassword('')
      setIsError(false)
    } catch (error) {
      handleLogError(error)
      setIsError(true)
    }
  }

  if (isLoggedIn) {
    return <Navigate to='/' />
  }

  return (
    <Center mt='xl'>
      <Box w={450}>
        <form onSubmit={handleSubmit}>
          <Paper withBorder p='xl' shadow='sm' radius='md'>
            <Stack gap='sm'>
              <TextInput
                autoFocus
                name='username'
                label='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <PasswordInput
                name='password'
                label='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type='submit' color='grape' fullWidth size='md'>Login</Button>
            </Stack>
          </Paper>
        </form>
        <Paper withBorder p='sm' radius='md' mt='sm' ta='center' shadow='sm'>
          Don't have an account?{' '}
          <Anchor component={NavLink} to='/signup'>Sign Up</Anchor>
        </Paper>
        {isError && (
          <Alert color='red' variant='light'>
            The username or password provided are incorrect!
          </Alert>
        )}

        <Divider label='or connect with' labelPosition='center' my='xs' />

        <Button.Group style={{ width: '100%' }}>
          <Button
            component='a'
            href={getSocialLoginUrl('github')}
            variant='outline'
            color='dark'
            style={{ flex: 1, flexDirection: 'column', height: 'auto', padding: '8px 4px' }}
          >
            <IconBrandGithubFilled size={20} />
            <span>Github</span>
          </Button>
          <Button
            component='a'
            href={getSocialLoginUrl('google')}
            variant='outline'
            color='dark'
            style={{ flex: 1, flexDirection: 'column', height: 'auto', padding: '8px 4px' }}
          >
            <IconBrandGoogleFilled size={20} />
            <span>Google</span>
          </Button>
          <Button
            variant='outline'
            color='dark'
            style={{ flex: 1, flexDirection: 'column', height: 'auto', padding: '8px 4px' }}
            disabled
          >
            <IconBrandFacebookFilled size={20} />
            <span>Facebook</span>
          </Button>
          <Button
            variant='outline'
            color='dark'
            style={{ flex: 1, flexDirection: 'column', height: 'auto', padding: '8px 4px' }}
            disabled
          >
            <IconBrandInstagramFilled size={20} />
            <span>Instagram</span>
          </Button>
        </Button.Group>
      </Box>
    </Center>
  )
}

export default Login
