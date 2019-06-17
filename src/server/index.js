import express from 'express'
import { resolve } from 'path'
import compression from 'compression'

import renderer from 'server/renderer'
import { isBot } from 'server/bot'

const app = express()
const clientDir = resolve(__dirname, '..', 'client')

if (process.env.NODE_ENV === 'production') {
  app.use(compression())
}

app.get('/favicon.ico', (req, res) => res.status(204))

app.use(express.static(clientDir))

app.get('/*', (req, res, next) => {
  const getBot = isBot(req.headers['user-agent'])
  if (getBot) {
    renderer(req, res, next)
  } else {
    res.sendFile(`${clientDir}/main.html`)
  }
})

app.listen(8000, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.log('Rodando na porta 8000')
  }
})
