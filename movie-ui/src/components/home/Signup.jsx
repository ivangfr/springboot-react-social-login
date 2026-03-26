import { useState } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import { Button, TextInput, PasswordInput, Paper, Stack, Alert, Anchor, Center, Box } from '@mantine/core'
import { useAuth } from '../context/AuthContext'
import { movieApi } from '../misc/MovieApi'
import { parseJwt, handleLogError } from '../misc/Helpers'
import { IconInfoCircle } from '@tabler/icons-react'

function Signup() {
  const Auth = useAuth()
  const isLoggedIn = Auth.userIsAuthenticated()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!(username && password && name && email)) {
      setIsError(true)
      setErrorMessage('Please, inform all fields!')
      return
    }

    const user = { username, password, name, email }

    try {
      const response = await movieApi.signup(user)
      const { accessToken } = response.data
      const data = parseJwt(accessToken)
      const authenticatedUser = { data, accessToken }

      Auth.userLogin(authenticatedUser)

      setUsername('')
      setPassword('')
      setIsError(false)
      setErrorMessage('')
    } catch (error) {
      handleLogError(error)
      if (error.response && error.response.data) {
        const errorData = error.response.data
        let message = 'Invalid fields'
        if (errorData.status === 409) {
          message = errorData.message
        } else if (errorData.status === 400) {
          message = errorData.errors[0].defaultMessage
        }
        setIsError(true)
        setErrorMessage(message)
      }
    }
  }

  if (isLoggedIn) {
    return <Navigate to='/' />
  }

  return (
    <Center mt='xl'>
      <Box w={450}>
        <form onSubmit={handleSubmit}>
          <Paper withBorder p='xl' radius='md' shadow='sm'>
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
              <TextInput
                name='name'
                label='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextInput
                name='email'
                label='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type='submit' color='grape' fullWidth>Sign Up</Button>
            </Stack>
          </Paper>
        </form>
        <Paper withBorder p='sm' radius='md' mt='sm' ta='center' shadow='sm'>
          Already have an account?{' '}
          <Anchor component={NavLink} to='/login'>Login</Anchor>
        </Paper>
        {isError && (
          <Alert color='red' variant='light' mt='sm' icon={<IconInfoCircle />}>
            {errorMessage}
          </Alert>
        )}
      </Box>
    </Center>
  )
}

export default Signup
