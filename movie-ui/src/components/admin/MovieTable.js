import React, { Fragment } from 'react'
import { Button, Form, Grid, Image, Input, Table } from 'semantic-ui-react'
import MovieForm from './MovieForm'

function MovieTable({ movies, movieImdb, movieTitle, moviePoster, movieTextSearch, handleInputChange, handleAddMovie, handleDeleteMovie, handleSearchMovie }) {
  let movieList
  if (movies.length === 0) {
    movieList = (
      <Table.Row key='no-movie'>
        <Table.Cell collapsing textAlign='center' colSpan='5'>No movie</Table.Cell>
      </Table.Row>
    )
  } else {
    movieList = movies.map(movie => {
      return (
        <Table.Row key={movie.imdb}>
          <Table.Cell collapsing>
            <Button
              circular
              color='red'
              size='small'
              icon='trash'
              onClick={() => handleDeleteMovie(movie.imdb)}
            />
          </Table.Cell>
          <Table.Cell>
            { movie.poster ?
            <Image src={movie.poster} size='tiny' bordered rounded /> :
            <Image src='/images/movie-poster.jpg' size='tiny' bordered rounded />
            }
          </Table.Cell>
          <Table.Cell>{movie.imdb}</Table.Cell>
          <Table.Cell>{movie.title}</Table.Cell>
          <Table.Cell>{movie.createdAt}</Table.Cell>
        </Table.Row>
      )
    })
  }

  return (
    <Fragment>
      <Grid stackable divided>
        <Grid.Row columns='2'>
          <Grid.Column width='5'>
            <Form onSubmit={handleSearchMovie}>
              <Input
                action={{ icon: 'search' }}
                name='movieTextSearch'
                placeholder='Search by Imdb or Title'
                value={movieTextSearch}
                onChange={handleInputChange}
              />
            </Form>
          </Grid.Column>
          <Grid.Column>
            <MovieForm
              movieImdb={movieImdb}
              movieTitle={movieTitle}
              moviePoster={moviePoster}
              handleInputChange={handleInputChange}
              handleAddMovie={handleAddMovie}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table compact striped selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1}/>
            <Table.HeaderCell width={4}>Poster</Table.HeaderCell>
            <Table.HeaderCell width={3}>IMDB</Table.HeaderCell>
            <Table.HeaderCell width={4}>Title</Table.HeaderCell>
            <Table.HeaderCell width={4}>CreatedAt</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {movieList}
        </Table.Body>
      </Table>
    </Fragment>
  )
}

export default MovieTable