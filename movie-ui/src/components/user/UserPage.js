import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import MovieList from './MovieList'
import AuthContext from '../context/AuthContext'
import { movieApi } from '../misc/MovieApi'

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

  handleInputChange = (e) => {
    const { id, value } = e.target
    this.setState({ [id]: value })
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
        console.log(error.message)
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
        console.log(error.message)
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