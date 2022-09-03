const { Router } = require('express')
const { SubjectController } = require('../controllers')
const { validateToken } = require('../middlewares')
const subjectRoutes = Router()

subjectRoutes.post('/create', validateToken, SubjectController.create)
subjectRoutes.get('/list', validateToken, SubjectController.list)
subjectRoutes.get('/:id', validateToken, SubjectController.getById)
subjectRoutes.delete('/:id', validateToken, SubjectController.delete)
subjectRoutes.patch('/:id', validateToken, SubjectController.update)

module.exports = subjectRoutes
