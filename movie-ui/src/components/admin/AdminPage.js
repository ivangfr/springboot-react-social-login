import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
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

  handleGetUsers = () => {
    const Auth = this.context
    const user = Auth.getUser()

    this.setState({ isUsersLoading: true })
    movieApi.getUsers(user)
      .then(response => {
        this.setState({ users: response.data })
      })
      .catch(error => {
        handleLogError(error)
      })
      .finally(() => {
        this.setState({ isUsersLoading: false })
      })
  }

  handleDeleteUser = (username) => {
    const Auth = this.context
    const user = Auth.getUser()

    movieApi.deleteUser(user, username)
      .then(() => {
        this.handleGetUsers()
      })
      .catch(error => {
        handleLogError(error)
      })
  }

  handleSearchUser = () => {
    const Auth = this.context
    const user = Auth.getUser()

    const username = this.state.userUsernameSearch
    movieApi.getUsers(user, username)
      .then(response => {
        const data = response.data
        const users = data instanceof Array ? data : [data]
        this.setState({ users })
      })
      .catch(error => {
        handleLogError(error)
        this.setState({ users: [] })
      })
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

  handleDeleteMovie = (imdb) => {
    const Auth = this.context
    const user = Auth.getUser()

    movieApi.deleteMovie(user, imdb)
      .then(() => {
        this.handleGetMovies()
      })
      .catch(error => {
        handleLogError(error)
      })
  }

  handleAddMovie = () => {
    const Auth = this.context
    const user = Auth.getUser()

    let { movieImdb, movieTitle, moviePoster } = this.state
    movieImdb = movieImdb.trim()
    movieTitle = movieTitle.trim()
    moviePoster = moviePoster.trim()
    if (!(movieImdb && movieTitle)) {
      return
    }

    const movie = { imdb: movieImdb, title: movieTitle, poster: moviePoster }
    movieApi.addMovie(user, movie)
      .then(() => {
        this.clearMovieForm()
        this.handleGetMovies()
      })
      .catch(error => {
        handleLogError(error)
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

  clearMovieForm = () => {
    this.setState({
      movieImdb: '',
      movieTitle: ''
    })
  }

  render() {
    if (!this.state.isAdmin) {
      return <Redirect to='/' />
    } else {
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
}

export default AdminPage