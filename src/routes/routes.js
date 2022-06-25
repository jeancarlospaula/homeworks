const express = require('express')
const cors = require('cors')
const handlerRequestError = require('../middlewares/handlerRequestError')
const accountRoutes = require('./account.routes')

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

module.exports = routes
