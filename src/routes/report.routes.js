const { Router } = require('express')
const { validateToken } = require('../middlewares/validateToken')
const ReportController = require('../controllers/Report.controller')

const reportRoutes = Router()
reportRoutes.get('/', validateToken, ReportController.generate)

module.exports = reportRoutes
