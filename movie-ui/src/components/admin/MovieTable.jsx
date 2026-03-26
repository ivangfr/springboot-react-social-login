import { Fragment } from 'react'
import { Table, ActionIcon, Image, TextInput, Grid } from '@mantine/core'
import { IconTrash, IconSearch } from '@tabler/icons-react'
import MovieForm from './MovieForm'

function MovieTable({ movies, movieImdb, movieTitle, moviePoster, movieTextSearch, handleInputChange, handleAddMovie, handleDeleteMovie, handleSearchMovie }) {
  let movieList
  if (movies.length === 0) {
    movieList = (
      <Table.Tr>
        <Table.Td colSpan={5} ta='center'>No movie</Table.Td>
      </Table.Tr>
    )
  } else {
    movieList = movies.map(movie => (
      <Table.Tr key={movie.imdb}>
        <Table.Td>
          <ActionIcon color='red' variant='filled' size='sm' onClick={() => handleDeleteMovie(movie.imdb)}>
            <IconTrash size={14} />
          </ActionIcon>
        </Table.Td>
        <Table.Td>
          <Image
            src={movie.poster || '/images/movie-poster.jpg'}
            w={60}
            radius='sm'
            fit='cover'
          />
        </Table.Td>
        <Table.Td>{movie.imdb}</Table.Td>
        <Table.Td>{movie.title}</Table.Td>
        <Table.Td>{movie.createdAt}</Table.Td>
      </Table.Tr>
    ))
  }

  return (
    <Fragment>
      <Grid mb='md'>
        <Grid.Col span={{ base: 12, sm: 5 }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSearchMovie() }}>
            <TextInput
              name='movieTextSearch'
              placeholder='Search by Imdb or Title'
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
        <Grid.Col span={{ base: 12, sm: 7 }}>
          <MovieForm
            movieImdb={movieImdb}
            movieTitle={movieTitle}
            moviePoster={moviePoster}
            handleInputChange={handleInputChange}
            handleAddMovie={handleAddMovie}
          />
        </Grid.Col>
      </Grid>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40} />
            <Table.Th>Poster</Table.Th>
            <Table.Th>IMDB</Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>CreatedAt</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{movieList}</Table.Tbody>
      </Table>
    </Fragment>
  )
}

export default MovieTable
