import { Tabs, Box, LoadingOverlay } from '@mantine/core'
import { IconUsers, IconVideo } from '@tabler/icons-react'
import UserTable from './UserTable'
import MovieTable from './MovieTable'

function AdminTab(props) {
  const { handleInputChange } = props
  const { isUsersLoading, users, userUsernameSearch, handleDeleteUser, handleSearchUser } = props
  const { isMoviesLoading, movies, movieImdb, movieTitle, moviePoster, movieTextSearch, handleAddMovie, handleDeleteMovie, handleSearchMovie } = props

  return (
    <Tabs defaultValue='users'>
      <Tabs.List>
        <Tabs.Tab value='users' leftSection={<IconUsers size={16} />}>Users</Tabs.Tab>
        <Tabs.Tab value='movies' leftSection={<IconVideo size={16} />}>Movies</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value='users' pt='md'>
        <Box pos='relative'>
          <LoadingOverlay visible={isUsersLoading} />
          <UserTable
            users={users}
            userUsernameSearch={userUsernameSearch}
            handleInputChange={handleInputChange}
            handleDeleteUser={handleDeleteUser}
            handleSearchUser={handleSearchUser}
          />
        </Box>
      </Tabs.Panel>

      <Tabs.Panel value='movies' pt='md'>
        <Box pos='relative'>
          <LoadingOverlay visible={isMoviesLoading} />
          <MovieTable
            movies={movies}
            movieImdb={movieImdb}
            movieTitle={movieTitle}
            moviePoster={moviePoster}
            movieTextSearch={movieTextSearch}
            handleInputChange={handleInputChange}
            handleAddMovie={handleAddMovie}
            handleDeleteMovie={handleDeleteMovie}
            handleSearchMovie={handleSearchMovie}
          />
        </Box>
      </Tabs.Panel>
    </Tabs>
  )
}

export default AdminTab
