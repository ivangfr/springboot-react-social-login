import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import MovieList from './MovieList'
import { useAuth } from '../context/AuthContext'
import { movieApi } from '../misc/MovieApi'
import { handleLogError } from '../misc/Helpers'

function UserPage() {
  const Auth = useAuth()
  const user = Auth.getUser()
  const isUser = user.data.rol[0] === 'USER'

  const [movies, setMovies] = useState([])
  const [movieTextSearch, setMovieTextSearch] = useState('')
  const [isMoviesLoading, setIsMoviesLoading] = useState(false)

  useEffect(() => {
    handleGetMovies()
  }, [])

  const handleInputChange = (e, { name, value }) => {
    if (name === 'movieTextSearch') {
      setMovieTextSearch(value)
    }
  }

  const handleGetMovies = async () => {
    setIsMoviesLoading(true)
    try {
      const response = await movieApi.getMovies(user)
      setMovies(response.data)
    } catch (error) {
      handleLogError(error)
    } finally {
      setIsMoviesLoading(false)
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

  if (!isUser) {
    return <Navigate to='/' />
  }

  return (
    <Container>
      <MovieList
        isMoviesLoading={isMoviesLoading}
        movieTextSearch={movieTextSearch}
        movies={movies}
        handleInputChange={handleInputChange}
        handleSearchMovie={handleSearchMovie}
      />
    </Container>
  )
}

export default UserPage