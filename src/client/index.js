import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
// import jwtDecode from 'jwt-decode'

// import setAuthorizationToken from 'client/utils/setAuthorizationToken'
import store from 'client/store'
import App from 'client/App'
// import { setCurrentUser } from 'shared/ducks/auth'

// if (window.localStorage.jwtToken) {
//   const token = window.localStorage.jwtToken
//   setAuthorizationToken(token)
//   store.dispatch(setCurrentUser(jwtDecode(token)))
// }

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
