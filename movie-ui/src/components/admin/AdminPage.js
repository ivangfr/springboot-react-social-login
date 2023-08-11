import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import { useAuth } from '../context/AuthContext'
import AdminTab from './AdminTab'
import { movieApi } from '../misc/MovieApi'
import { handleLogError } from '../misc/Helpers'

function AdminPage() {
  const Auth = useAuth()
  const user = Auth.getUser()
  const isAdmin = user.data.rol[0] === 'ADMIN'

  const [users, setUsers] = useState([])
  const [movies, setMovies] = useState([])
  const [movieImdb, setMovieImdb] = useState('')
  const [movieTitle, setMovieTitle] = useState('')
  const [moviePoster, setMoviePoster] = useState('')
  const [movieTextSearch, setMovieTextSearch] = useState('')
  const [userUsernameSearch, setUserUsernameSearch] = useState('')
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [isMoviesLoading, setIsMoviesLoading] = useState(false)

  useEffect(() => {
    handleGetUsers()
    handleGetMovies()
  }, [])

  const handleInputChange = (e, { name, value }) => {
    if (name === 'movieImdb') {
      setMovieImdb(value)
    } else if (name === 'movieTitle') {
      setMovieTitle(value)
    } else if (name === 'moviePoster') {
      setMoviePoster(value)
    } else if (name === 'movieTextSearch') {
      setMovieTextSearch(value)
    } else if (name === 'userUsernameSearch') {
      setUserUsernameSearch(value)
    }
  }

  const handleGetUsers = async () => {
    try {
      setIsUsersLoading(true)
      const response = await movieApi.getUsers(user)
      setUsers(response.data)
    } catch (error) {
      handleLogError(error)
    } finally {
      setIsUsersLoading(false)
    }
  }

  const handleDeleteUser = async (username) => {
    try {
      await movieApi.deleteUser(user, username)
      await handleGetUsers()
    } catch (error) {
      handleLogError(error)
    }
  }

  const handleSearchUser = async () => {
    try {
      const response = await movieApi.getUsers(user, userUsernameSearch)
      const data = response.data
      const users = Array.isArray(data) ? data : [data]
      setUsers(users)
    } catch (error) {
      handleLogError(error)
      setUsers([])
    }
  }

  const handleGetMovies = async () => {
    try {
      setIsMoviesLoading(true)
      const response = await movieApi.getMovies(user)
      setMovies(response.data)
    } catch (error) {
      handleLogError(error)
    } finally {
      setIsMoviesLoading(false)
    }
  }

  const handleDeleteMovie = async (imdb) => {
    try {
      await movieApi.deleteMovie(user, imdb)
      await handleGetMovies()
    } catch (error) {
      handleLogError(error)
    }
  }

  const handleAddMovie = async () => {
    const trimmedImdb = movieImdb.trim()
    const trimmedTitle = movieTitle.trim()
    const trimmedPoster = moviePoster.trim()

    if (!(trimmedImdb && trimmedTitle)) {
      return
    }

    const movie = { imdb: trimmedImdb, title: trimmedTitle, poster: trimmedPoster }

    try {
      await movieApi.addMovie(user, movie)
      clearMovieForm()
      await handleGetMovies()
    } catch (error) {
      handleLogError(error)
    }
  }

  const handleSearchMovie = async () => {
    try {
      const response = await movieApi.getMovies(user, movieTextSearch)
      const movies = response.data
      setMovies(movies)
    } catch (error) {
      handleLogError(error)
      setMovies([])
    }
  }

  const clearMovieForm = () => {
    setMovieImdb('')
    setMovieTitle('')
    setMoviePoster('')
  }

  if (!isAdmin) {
    return <Navigate to='/' />
  }

  return (
    <Container>
      <AdminTab
        isUsersLoading={isUsersLoading}
        users={users}
        userUsernameSearch={userUsernameSearch}
        handleDeleteUser={handleDeleteUser}
        handleSearchUser={handleSearchUser}
        isMoviesLoading={isMoviesLoading}
        movies={movies}
        movieImdb={movieImdb}
        movieTitle={movieTitle}
        moviePoster={moviePoster}
        movieTextSearch={movieTextSearch}
        handleAddMovie={handleAddMovie}
        handleDeleteMovie={handleDeleteMovie}
        handleSearchMovie={handleSearchMovie}
        handleInputChange={handleInputChange}
      />
    </Container>
  )
}

export default AdminPage