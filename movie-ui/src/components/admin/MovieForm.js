import React from 'react'
import { Form, Icon, Button } from 'semantic-ui-react'

function MovieForm({ movieImdb, movieTitle, moviePoster, handleInputChange, handleAddMovie }) {
  const createBtnDisabled = movieImdb.trim() === '' || movieTitle.trim() === ''
  return (
    <Form onSubmit={handleAddMovie}>
      <Form.Group>
        <Form.Input
          id='movieImdb'
          placeholder='IMDB *'
          value={movieImdb}
          onChange={handleInputChange}
        />
        <Form.Input
          id='movieTitle'
          placeholder='Title *'
          value={movieTitle}
          onChange={handleInputChange}
        />
        <Form.Input
          id='moviePoster'
          placeholder='Poster'
          value={moviePoster}
          onChange={handleInputChange}
        />
        <Button icon labelPosition='right' disabled={createBtnDisabled}>
          Create<Icon name='add' />
        </Button>
      </Form.Group>
    </Form>
  )
}

export default MovieForm
