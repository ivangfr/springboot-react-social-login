import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import AuthContext from '../context/AuthContext'
import { movieApi } from '../misc/MovieApi'
import AdminTab from './AdminTab'

class AdminPage extends Component {
  static contextType = AuthContext

  state = {
    users: [],
    movies: [],
    movieImdb: '',
    movieTitle: '',
    movieTextSearch: '',
    userUsernameSearch: '',
    isAdmin: true,
    isUsersLoading: false,
    isMoviesLoading: false,
  }

  componentDidMount() {
    const Auth = this.context
    const user = Auth.getUser()
    const isAdmin = user.role === 'ADMIN'
    this.setState({ isAdmin })

    this.getUsers()
    this.getMovies()
  }

  handleChange = (e) => {
    const { id, value } = e.target
    this.setState({ [id]: value })
  }

  getUsers = () => {
    const Auth = this.context
    const user = Auth.getUser()

    this.setState({ isUsersLoading: true })
    movieApi.getUsers(user)
      .then(response => {
        this.setState({ users: response.data })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        this.setState({ isUsersLoading: false })
      })
  }

  deleteUser = (username) => {
    const Auth = this.context
    const user = Auth.getUser()

    movieApi.deleteUser(user, username)
      .then(() => {
        this.getUsers()
      })
      .catch(error => {
        console.log(error)
      })
  }

  searchUser = () => {
    const Auth = this.context
    const user = Auth.getUser()

    const username = this.state.userUsernameSearch
    movieApi.getUsers(user, username)
      .then(response => {
        if (response.status === 200) {
          const data = response.data;
          const users = data instanceof Array ? data : [data]
          this.setState({ users })
        } else {
          this.setState({ users: [] })
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ users: [] })
      })
  }

  getMovies = () => {
    const Auth = this.context
    const user = Auth.getUser()

    this.setState({ isMoviesLoading: true })
    movieApi.getMovies(user)
      .then(response => {
        this.setState({ movies: response.data })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        this.setState({ isMoviesLoading: false })
      })
  }

  deleteMovie = (imdb) => {
    const Auth = this.context
    const user = Auth.getUser()

    movieApi.deleteMovie(user, imdb)
      .then(() => {
        this.getMovies()
      })
      .catch(error => {
        console.log(error)
      })
  }

  addMovie = () => {
    const Auth = this.context
    const user = Auth.getUser()

    const { movieImdb, movieTitle } = this.state
    if (!(movieImdb && movieTitle)) {
      return
    }

    const movie = { imdb: movieImdb, title: movieTitle }
    movieApi.addMovie(user, movie)
      .then(() => {
        this.clearMovieForm()
        this.getMovies()
      })
      .catch(error => {
        console.log(error)
      })
  }

  searchMovie = () => {
    const Auth = this.context
    const user = Auth.getUser()

    const text = this.state.movieTextSearch
    movieApi.getMovies(user, text)
      .then(response => {
        if (response.status === 200) {
          const data = response.data;
          const movies = data instanceof Array ? data : [data]
          this.setState({ movies })
        } else {
          this.setState({ movies: [] })
        }
      })
      .catch(error => {
        console.log(error)
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
      const { isUsersLoading, users, userUsernameSearch, isMoviesLoading, movies, movieImdb, movieTitle, movieTextSearch } = this.state
      return (
        <Container>
          <AdminTab
            isUsersLoading={isUsersLoading}
            users={users}
            userUsernameSearch={userUsernameSearch}
            deleteUser={this.deleteUser}
            searchUser={this.searchUser}
            isMoviesLoading={isMoviesLoading}
            movies={movies}
            movieImdb={movieImdb}
            movieTitle={movieTitle}
            movieTextSearch={movieTextSearch}
            addMovie={this.addMovie}
            deleteMovie={this.deleteMovie}
            searchMovie={this.searchMovie}
            handleChange={this.handleChange}
          />
        </Container>
      )
    }
  }
}

export default AdminPage