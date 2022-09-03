const express = require('express')
const cors = require('cors')
const { handlerRequestError } = require('../middlewares')
const {
  accountRoutes,
  subjectRoutes,
  taskRoutes,
  reportRoutes
} = require('./index.js')

const routes = express.Router()
routes.use(
  express.json(),
  cors({
    origin: '*'
  }),
  handlerRequestError
)

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'API active' })
})

routes.use('/account', accountRoutes)
routes.use('/subject', subjectRoutes)
routes.use('/task', taskRoutes)
routes.use('/report', reportRoutes)

module.exports = routes
