import React from 'react'
import { Tab } from 'semantic-ui-react'
import UserTable from './UserTable'
import MovieTable from './MovieTable'

function AdminTab(props) {
  const { handleInputChange } = props
  const { isUsersLoading, users, userUsernameSearch, handleDeleteUser, handleSearchUser } = props
  const { isMoviesLoading, movies, movieImdb, movieTitle, moviePoster, movieTextSearch, handleAddMovie, handleDeleteMovie, handleSearchMovie } = props

  const panes = [
    {
      menuItem: { key: 'users', icon: 'users', content: 'Users' },
      render: () => (
        <Tab.Pane loading={isUsersLoading}>
          <UserTable
            users={users}
            userUsernameSearch={userUsernameSearch}
            handleInputChange={handleInputChange}
            handleDeleteUser={handleDeleteUser}
            handleSearchUser={handleSearchUser}
          />
        </Tab.Pane>
      )
    },
    {
      menuItem: { key: 'movies', icon: 'video camera', content: 'Movies' },
      render: () => (
        <Tab.Pane loading={isMoviesLoading}>
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
        </Tab.Pane>
      )
    }
  ]

  return (
    <Tab menu={{ attached: 'top' }} panes={panes} />
  )
}

export default AdminTab