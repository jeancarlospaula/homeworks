const express = require('express')
const cors = require('cors')
const handlerRequestError = require('../middlewares/handlerRequestError')
const accountRoutes = require('./account.routes')
const subjectRoutes = require('./subject.routes')
const taskRoutes = require('./task.routes')
const reportRoutes = require('./report.routes')

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
