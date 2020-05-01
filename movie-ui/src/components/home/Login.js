import React, { Component } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { Button, Form, Grid, Segment, Message } from 'semantic-ui-react'
import AuthContext from '../context/AuthContext'
import { movieApi } from '../misc/MovieApi'

class Login extends Component {
  static contextType = AuthContext

  state = {
    username: '',
    password: '',
    isLoggedIn: false,
    isError: false
  }

  componentDidMount() {
    const Auth = this.context
    const isLoggedIn = Auth.userIsAuthenticated()
    this.setState({ isLoggedIn })
  }

  handleChange = (e) => {
    const { id, value } = e.target
    this.setState({ [id]: value })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { username, password } = this.state
    if (!(username && password)) {
      this.setState({ isError: true })
      return
    }

    movieApi.authenticate(username, password)
      .then(response => {
        if (response.status === 200) {
          const { id, name, role, accessToken } = response.data
          const user = { id, name, role, accessToken }

          const Auth = this.context
          Auth.userLogin(user)

          this.setState({
            username: '',
            password: '',
            isLoggedIn: true,
            isError: false
          })
        } else {
          this.setState({ isError: true })
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ isError: true })
      })
  }

  getReferer = () => {
    const locationState = this.props.location.state
    return locationState && locationState.referer ? locationState.referer : '/'
  }

  render() {
    const { isLoggedIn, isError } = this.state
    const referer = this.getReferer()
    if (isLoggedIn) {
      return <Redirect to={referer} />
    } else {
      return (
        <Grid textAlign='center'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Form size='large' onSubmit={this.handleSubmit}>
              <Segment>
                <Form.Input
                  fluid
                  autoFocus
                  id='username'
                  icon='user'
                  iconPosition='left'
                  placeholder='Username'
                  onChange={this.handleChange}
                />
                <Form.Input
                  fluid
                  id='password'
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  onChange={this.handleChange}
                />
                <Button color='purple' fluid size='large'>Login</Button>
              </Segment>
            </Form>
            <Message>{`Don't have already an account? `}
              <a href='/signup' color='purple' as={NavLink} to="/signup">Sign Up</a>
            </Message>
            {isError && <Message negative>The username or password provided are incorrect!</Message>}
          </Grid.Column>
        </Grid>
      )
    }
  }
}

export default Login