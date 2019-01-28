import React, { Component } from 'react'
import { ListPullRequest } from './ListPullRequests'
import { ToastContainer } from 'react-toastify'
import store from 'store'

class App extends Component {
  state = {
    username: '',
    password: ''
  }

  componentDidMount() {
    const username = store.get('username')
    const password = store.get('password')
    this.setState({ username, password })
  }

  render() {
    return (
      <div className="container">
        <ToastContainer />
        <header>
          <h1>Bitbucket Tasks</h1>
        </header>

        <main>
          <div className="login-form">
            <form>
              <div>
                <label>Username</label>
                <input
                  type="text"
                  value={this.state.username}
                  onChange={e => {
                    e.preventDefault()
                    this.setState({ username: e.target.value })
                    store.set('username', e.target.value)
                  }}
                />
                <div>
                  <label>Password</label>
                  <input
                    type="password"
                    value={this.state.password}
                    onChange={e => {
                      e.preventDefault()
                      this.setState({ password: e.target.value })
                      store.set('password', e.target.value)
                    }}
                  />
                </div>
              </div>
            </form>
          </div>
          <ListPullRequest />
        </main>
      </div>
    )
  }
}

export default App
