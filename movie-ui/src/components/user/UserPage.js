import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import MovieList from './MovieList'
import AuthContext from '../context/AuthContext'
import { movieApi } from '../misc/MovieApi'
import { handleLogError } from '../misc/Helpers'

class UserPage extends Component {
  static contextType = AuthContext

  state = {
    movies: [],
    movieTextSearch: '',
    isUser: true,
    isMoviesLoading: false
  }

  componentDidMount() {
    const Auth = this.context
    const user = Auth.getUser()
    const isUser = user.data.rol[0] === 'USER'
    this.setState({ isUser })

    this.handleGetMovies()
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  handleGetMovies = () => {
    const Auth = this.context
    const user = Auth.getUser()

    this.setState({ isMoviesLoading: true })
    movieApi.getMovies(user)
      .then(response => {
        this.setState({ movies: response.data })
      })
      .catch(error => {
        handleLogError(error)
      })
      .finally(() => {
        this.setState({ isMoviesLoading: false })
      })
  }

  handleSearchMovie = () => {
    const Auth = this.context
    const user = Auth.getUser()

    const text = this.state.movieTextSearch
    movieApi.getMovies(user, text)
      .then(response => {
        const movies = response.data
        this.setState({ movies })
      })
      .catch(error => {
        handleLogError(error)
        this.setState({ movies: [] })
      })
  }

  render() {
    if (!this.state.isUser) {
      return <Redirect to='/' />
    } else {
      const { isMoviesLoading, movies, movieTextSearch } = this.state
      return (
        <Container>
          <MovieList
            isMoviesLoading={isMoviesLoading}
            movieTextSearch={movieTextSearch}
            movies={movies}
            handleInputChange={this.handleInputChange}
            handleSearchMovie={this.handleSearchMovie}
          />
        </Container>
      )
    }
  }
}

export default UserPage