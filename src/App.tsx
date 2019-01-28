import React, { Component } from 'react'
import { ListPullRequest } from './ListPullRequests'
import { ToastContainer } from 'react-toastify'

class App extends Component {
  render() {
    return (
      <div className="container">
        <ToastContainer />
        <header>
          <h1>Bitbucket Tasks</h1>
        </header>
        <main>
          <p>Tasks go here</p>
          <ListPullRequest />
        </main>
      </div>
    )
  }
}

export default App
