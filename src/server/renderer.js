import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter, matchPath } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Helmet } from 'react-helmet'

import store from 'client/store'
import App from 'client/App'
import routes from 'client/routes'

const renderer = (req, res, next) => {
  const activeRoute = routes.find(route => {
    let matchRoute = matchPath(req.url, route.path)
    if (matchRoute && matchRoute.isExact === true) {
      return route
    }
  })

  const promise = activeRoute.loadData ? store.dispatch(activeRoute.loadData) : Promise.resolve()
  if (promise instanceof Promise) {
    promise.then(() => {
      console.log(store.getState())
      genStatic(req, res, store)
    }).catch(next)
  } else {
    console.log(store.getState())
    genStatic(req, res, store)
  }
}

const genStatic = (req, res, store) => {
  const context = {}

  const app = (
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  )

  const markup = renderToString(app)
  const helmet = Helmet.renderStatic()

  let html = `
    <!DOCTYPE html>
    <html>
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
      </head>
      <body>
        <div id="root">${markup}</div>
      </body>
    </html>
  `

  res.set('content-type', 'text/html')
  if (context.url) {
    res.redirect(301, context.url)
  } else {
    res.send(html)
  }
}

export default renderer
