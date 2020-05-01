import React from 'react'
import { Tab } from 'semantic-ui-react'
import UserTable from './UserTable'
import MovieTable from './MovieTable'

function AdminTab(props) {
  const { handleChange } = props
  const { isUsersLoading, users, userUsernameSearch, deleteUser, searchUser } = props
  const { isMoviesLoading, movies, movieImdb, movieTitle, movieTextSearch, addMovie, deleteMovie, searchMovie } = props

  const panes = [
    {
      menuItem: { key: 'users', icon: 'users', content: 'Users' },
      render: () => (
        <Tab.Pane loading={isUsersLoading}>
          <UserTable
            users={users}
            userUsernameSearch={userUsernameSearch}
            handleChange={handleChange}
            deleteUser={deleteUser}
            searchUser={searchUser}
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
            movieTextSearch={movieTextSearch}
            handleChange={handleChange}
            addMovie={addMovie}
            deleteMovie={deleteMovie}
            searchMovie={searchMovie}
          />
        </Tab.Pane>
      )
    }
  ]

  return (
    <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
  )
}

export default AdminTab