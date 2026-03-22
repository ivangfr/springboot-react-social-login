import { TextInput, Button, Group } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

function MovieForm({ movieImdb, movieTitle, moviePoster, handleInputChange, handleAddMovie }) {
  const createBtnDisabled = movieImdb.trim() === '' || movieTitle.trim() === ''
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleAddMovie() }}>
      <Group gap='sm' wrap='wrap'>
        <TextInput
          name='movieImdb'
          placeholder='IMDB *'
          value={movieImdb}
          onChange={handleInputChange}
        />
        <TextInput
          name='movieTitle'
          placeholder='Title *'
          value={movieTitle}
          onChange={handleInputChange}
        />
        <TextInput
          name='moviePoster'
          placeholder='Poster'
          value={moviePoster}
          onChange={handleInputChange}
        />
        <Button
          type='submit'
          color='grape'
          leftSection={<IconPlus size={16} />}
          disabled={createBtnDisabled}
        >
          Create
        </Button>
      </Group>
    </form>
  )
}

export default MovieForm
