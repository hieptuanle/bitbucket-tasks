import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'mobx-react'
import { ListPullRequestsStore } from './store/list-pull-requests.store'
import { IntlProvider } from 'react-intl'
import 'react-toastify/dist/ReactToastify.css'

import 'react-datepicker/dist/react-datepicker-cssmodules.css'

ReactDOM.render(
  <Provider listPullRequestsStore={new ListPullRequestsStore()}>
    <IntlProvider locale="en">
      <App />
    </IntlProvider>
  </Provider>,

  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
