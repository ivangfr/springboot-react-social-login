import { Grid, Title, Group, Image, TextInput, Card, Stack, Text, Skeleton, ActionIcon, Paper } from '@mantine/core'
import { IconVideo, IconSearch } from '@tabler/icons-react'

function MovieList({ isMoviesLoading, movieTextSearch, movies, handleInputChange, handleSearchMovie }) {
  let movieList
  if (isMoviesLoading) {
    movieList = [1, 2, 3].map(i => (
      <Card key={i} withBorder padding='sm' radius='md'>
        <Grid align='center'>
          <Grid.Col span='content'>
            <Skeleton w={100} h={140} radius='sm' animate={false} />
          </Grid.Col>
          <Grid.Col span='auto'>
            <Stack gap='xs'>
              <Skeleton height={16} radius='xl' animate={false} />
              <Skeleton height={12} width='60%' radius='xl' animate={false} />
              <Skeleton height={8} mt={4} radius='xl' animate={false} />
              <Skeleton height={8} mt={4} radius='xl' width='70%' animate={false} />
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>
    ))
  } else if (movies.length === 0) {
    movieList = <Text c='dimmed'>No Movie</Text>
  } else {
    movieList = movies.map(movie => (
      <Card key={movie.imdb} withBorder padding='sm' radius='md'>
        <Grid align='center'>
          <Grid.Col span='content'>
            <Image
              src={movie.poster || '/images/movie-poster.jpg'}
              w={100}
              h={140}
              fit='cover'
              radius='sm'
            />
          </Grid.Col>
          <Grid.Col span='auto'>
            <Stack gap='xs'>
              <Text fw={600}>{movie.title}</Text>
              <Text size='sm' c='dimmed'>{movie.imdb}</Text>
              <Skeleton height={8} mt={4} radius='xl' animate={false} />
              <Skeleton height={8} mt={4} radius='xl' width='70%' animate={false} />
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>
    ))
  }

  return (
    <Paper withBorder p='md' style={{ borderTopColor: 'var(--mantine-color-grape-6)', borderTopWidth: 3 }}>
      <Grid mb='md'>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <Group gap='xs'>
            <IconVideo size={28} />
            <Title order={2}>Movies</Title>
          </Group>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 9 }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSearchMovie() }}>
            <TextInput
              name='movieTextSearch'
              placeholder='Search by IMDB or Title'
              value={movieTextSearch}
              onChange={handleInputChange}
              rightSection={
                <ActionIcon type='submit' variant='subtle' color='gray'>
                  <IconSearch size={16} />
                </ActionIcon>
              }
            />
          </form>
        </Grid.Col>
      </Grid>
      <Stack gap='sm'>
        {movieList}
      </Stack>
    </Paper>
  )
}

export default MovieList
