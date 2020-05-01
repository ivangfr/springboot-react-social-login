import React, { Fragment } from 'react'
import { Grid, Form, Icon, Button, Image, Input, Table } from 'semantic-ui-react'

function MovieTable({ movies, movieImdb, movieTitle, movieTextSearch, handleChange, addMovie, deleteMovie, searchMovie }) {
  let movieList
  if (movies.length === 0) {
    movieList = (
      <Table.Row key='no-movie'>
        <Table.Cell collapsing textAlign='center' colSpan='4'>No movie</Table.Cell>
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
              onClick={() => deleteMovie(movie.imdb)}
            />
          </Table.Cell>
          <Table.Cell>
            <Image src='https://react.semantic-ui.com/images/wireframe/image.png' size='tiny' bordered rounded />
          </Table.Cell>
          <Table.Cell>{movie.imdb}</Table.Cell>
          <Table.Cell>{movie.title}</Table.Cell>
        </Table.Row>
      )
    })
  }

  return (
    <Fragment>
      <Grid stackable divided>
        <Grid.Row columns='2'>
          <Grid.Column width='5'>
            <Form onSubmit={searchMovie}>
              <Input
                action={{ icon: 'search' }}
                id='movieTextSearch'
                placeholder='Search by Imdb or Title'
                value={movieTextSearch}
                onChange={handleChange}
              />
            </Form>
          </Grid.Column>
          <Grid.Column>
            <Form onSubmit={addMovie}>
              <Form.Group>
                <Form.Input
                  id='movieImdb'
                  placeholder='IMDB'
                  value={movieImdb}
                  onChange={handleChange}
                />
                <Form.Input
                  id='movieTitle'
                  placeholder='Title'
                  value={movieTitle}
                  onChange={handleChange}
                />
                <Button icon>
                  <Icon name='add' />
                </Button>
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table compact striped selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Cover</Table.HeaderCell>
            <Table.HeaderCell>IMDB</Table.HeaderCell>
            <Table.HeaderCell>Title</Table.HeaderCell>
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