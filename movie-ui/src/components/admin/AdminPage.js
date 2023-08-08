import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import AuthContext from '../context/AuthContext'
import { movieApi } from '../misc/MovieApi'
import AdminTab from './AdminTab'
import { handleLogError } from '../misc/Helpers'

class AdminPage extends Component {
  static contextType = AuthContext

  state = {
    users: [],
    movies: [],
    movieImdb: '',
    movieTitle: '',
    moviePoster: '',
    movieTextSearch: '',
    userUsernameSearch: '',
    isAdmin: true,
    isUsersLoading: false,
    isMoviesLoading: false,
  }

  componentDidMount() {
    const Auth = this.context
    const user = Auth.getUser()
    const isAdmin = user.data.rol[0] === 'ADMIN'
    this.setState({ isAdmin })

    this.handleGetUsers()
    this.handleGetMovies()
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  handleGetUsers = async () => {
    try {
      const user = this.context.getUser()

      this.setState({ isUsersLoading: true })

      const response = await movieApi.getUsers(user)
      this.setState({ users: response.data })
    } catch (error) {
      handleLogError(error)
    } finally {
      this.setState({ isUsersLoading: false })
    }
  }

  handleDeleteUser = async (username) => {
    const user = this.context.getUser()

    try {
      await movieApi.deleteUser(user, username)
      this.handleGetUsers()
    } catch (error) {
      handleLogError(error)
    }
  }

  handleSearchUser = async () => {
    const user = this.context.getUser()

    const username = this.state.userUsernameSearch
    try {
      const response = await movieApi.getUsers(user, username)
      const data = response.data
      const users = data instanceof Array ? data : [data]
      this.setState({ users })
    } catch (error) {
      handleLogError(error)
      this.setState({ users: [] })
    }
  }

  handleGetMovies = async () => {
    const Auth = this.context
    const user = Auth.getUser()

    this.setState({ isMoviesLoading: true })
    try {
      const response = await movieApi.getMovies(user)
      this.setState({ movies: response.data })
    } catch (error) {
      handleLogError(error)
    } finally {
      this.setState({ isMoviesLoading: false })
    }
  }

  handleDeleteMovie = async (imdb) => {
    const user = this.context.getUser()

    try {
      await movieApi.deleteMovie(user, imdb)
      await this.handleGetMovies()
    } catch (error) {
      handleLogError(error)
    }
  }

  handleAddMovie = async () => {
    const user = this.context.getUser()

    let { movieImdb, movieTitle, moviePoster } = this.state
    movieImdb = movieImdb.trim()
    movieTitle = movieTitle.trim()
    moviePoster = moviePoster.trim()
    if (!(movieImdb && movieTitle)) {
      return
    }

    const movie = { imdb: movieImdb, title: movieTitle, poster: moviePoster }

    try {
      await movieApi.addMovie(user, movie)
      this.clearMovieForm()
      await this.handleGetMovies()
    } catch (error) {
      handleLogError(error)
    }
  }

  handleSearchMovie = async () => {
    const user = this.context.getUser()

    const text = this.state.movieTextSearch
    try {
      const response = await movieApi.getMovies(user, text)
      const movies = response.data
      this.setState({ movies })
    } catch (error) {
      handleLogError(error)
      this.setState({ movies: [] })
    }
  }

  clearMovieForm = () => {
    this.setState({
      movieImdb: '',
      movieTitle: ''
    })
  }

  render() {
    if (!this.state.isAdmin) {
      return <Navigate to='/' />
    }

    const { isUsersLoading, users, userUsernameSearch, isMoviesLoading, movies, movieImdb, movieTitle, moviePoster, movieTextSearch } = this.state
    return (
      <Container>
        <AdminTab
          isUsersLoading={isUsersLoading}
          users={users}
          userUsernameSearch={userUsernameSearch}
          handleDeleteUser={this.handleDeleteUser}
          handleSearchUser={this.handleSearchUser}
          isMoviesLoading={isMoviesLoading}
          movies={movies}
          movieImdb={movieImdb}
          movieTitle={movieTitle}
          moviePoster={moviePoster}
          movieTextSearch={movieTextSearch}
          handleAddMovie={this.handleAddMovie}
          handleDeleteMovie={this.handleDeleteMovie}
          handleSearchMovie={this.handleSearchMovie}
          handleInputChange={this.handleInputChange}
        />
      </Container>
    )
  }
}

export default AdminPage