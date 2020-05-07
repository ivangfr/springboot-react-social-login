import React, { Component } from 'react'
import { Statistic, Icon, Grid, Container, Image, Segment } from 'semantic-ui-react'
import { movieApi } from '../misc/MovieApi'

class Home extends Component {
  state = {
    numberOfUsers: 0,
    numberOfMovies: 0,
    isLoadingNumberOfUsers: false,
    isLoadingNumberOfMovies: false,
  }

  componentDidMount() {
    this.handleGetNumberOfUsers()
    this.handleGetNumberOfMovies()
  }

  handleGetNumberOfUsers = () => {
    this.setState({ isLoadingNumberOfUsers: true })
    movieApi.numberOfUsers()
      .then(response => {
        this.setState({ numberOfUsers: response.data })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        this.setState({ isLoadingNumberOfUsers: false })
      })
  }

  handleGetNumberOfMovies = () => {
    this.setState({ getNumberOfMovies: true })
    movieApi.numberOfMovies()
      .then(response => {
        this.setState({ numberOfMovies: response.data })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        this.setState({ getNumberOfMovies: false })
      })
  }

  render() {
    const { isLoadingNumberOfUsers, numberOfUsers, isLoadingNumberOfMovies, numberOfMovies } = this.state
    return (
      <Container text>
        <Grid stackable columns={2}>
          <Grid.Row>
            <Grid.Column textAlign='center'>
              <Segment color='purple' loading={isLoadingNumberOfUsers}>
                <Statistic>
                  <Statistic.Value><Icon name='user' color='grey' />{numberOfUsers}</Statistic.Value>
                  <Statistic.Label>Users</Statistic.Label>
                </Statistic>
              </Segment>
            </Grid.Column>
            <Grid.Column textAlign='center'>
              <Segment color='purple' loading={isLoadingNumberOfMovies}>
                <Statistic>
                  <Statistic.Value><Icon name='laptop' color='grey' />{numberOfMovies}</Statistic.Value>
                  <Statistic.Label>Movies</Statistic.Label>
                </Statistic>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' style={{ marginTop: '2em' }} />
        <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' style={{ marginTop: '2em' }} />
      </Container>
    )
  }
}

export default Home