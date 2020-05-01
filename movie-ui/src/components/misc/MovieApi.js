import axios from 'axios'

export const movieApi = {
  authenticate,
  signup,
  numberOfUsers,
  numberOfMovies,
  getUsers,
  deleteUser,
  getMovies,
  deleteMovie,
  addMovie
}

function authenticate(username, password) {
  return instance.post('/auth/authenticate', { username, password }, {
    headers: { 'Content-type': 'application/json' }
  })
}

function signup(user) {
  return instance.post('/auth/signup', user, {
    headers: { 'Content-type': 'application/json' }
  })
}

function numberOfUsers() {
  return instance.get('/public/numberOfUsers');
}

function numberOfMovies() {
  return instance.get('/public/numberOfMovies');
}

function getUsers(user, username) {
  const url = username ? `/api/users/${username}` : '/api/users'
  return instance.get(url, {
    headers: { 'Authorization': bearerAuth(user) }
  })
}

function deleteUser(user, username) {
  return instance.delete(`/api/users/${username}`, {
    headers: { 'Authorization': bearerAuth(user) }
  })
}

function getMovies(user, text) {
  const url = text ? `/api/movies?text=${text}` : '/api/movies'
  return instance.get(url, {
    headers: { 'Authorization': bearerAuth(user) }
  })
}

function deleteMovie(user, id) {
  return instance.delete(`/api/movies/${id}`, {
    headers: { 'Authorization': bearerAuth(user) }
  })
}

function addMovie(user, movie) {
  return instance.post('/api/movies', movie, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(user)
    }
  })
}

// -- Axios

const instance = axios.create({
  baseURL: 'http://localhost:8080'
})

// -- Helper functions

function bearerAuth(user) {
  return `Bearer ${user.accessToken}`
}