const { Router } = require('express')
const { validateToken } = require('../middlewares')
const { ReportController } = require('../controllers')

const reportRoutes = Router()
reportRoutes.get('/', validateToken, ReportController.generate)

module.exports = reportRoutes
