const { Router } = require('express')
const SubjectController = require('../controllers/Subject.controller')
const { validateToken } = require('../middlewares/validateToken')
const subjectRoutes = Router()

subjectRoutes.post('/create', validateToken, SubjectController.create)
subjectRoutes.get('/list', validateToken, SubjectController.list)

module.exports = subjectRoutes
