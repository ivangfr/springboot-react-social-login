import { useEffect, useState } from 'react'
import { SimpleGrid, Paper, Text, Container, Box, LoadingOverlay } from '@mantine/core'
import { IconUsers, IconDeviceLaptop } from '@tabler/icons-react'
import { movieApi } from '../misc/MovieApi'
import { handleLogError } from '../misc/Helpers'

function Home() {
  const [numberOfUsers, setNumberOfUsers] = useState(0)
  const [numberOfMovies, setNumberOfMovies] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        let response = await movieApi.numberOfUsers()
        const users = response.data

        response = await movieApi.numberOfMovies()
        const movies = response.data

        setNumberOfUsers(users)
        setNumberOfMovies(movies)
      } catch (error) {
        handleLogError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <Container size='sm' mt='xl'>
      <Box pos='relative' mih={120}>
        <LoadingOverlay visible={isLoading} />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Paper withBorder p='xl' radius='md' ta='center'>
            <IconUsers size={32} color='gray' />
            <Text size='3rem' fw={700}>{numberOfUsers}</Text>
            <Text c='dimmed'>Users</Text>
          </Paper>
          <Paper withBorder p='xl' radius='md' ta='center'>
            <IconDeviceLaptop size={32} color='gray' />
            <Text size='3rem' fw={700}>{numberOfMovies}</Text>
            <Text c='dimmed'>Movies</Text>
          </Paper>
        </SimpleGrid>
      </Box>
    </Container>
  )
}

export default Home
