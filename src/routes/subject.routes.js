const { Router } = require('express')
const SubjectController = require('../controllers/Subject.controller')
const { validateToken } = require('../middlewares/validateToken')
const subjectRoutes = Router()

subjectRoutes.post('/create', validateToken, SubjectController.create)
subjectRoutes.get('/list', validateToken, SubjectController.list)
subjectRoutes.get('/:id', validateToken, SubjectController.getById)
subjectRoutes.delete('/:id', validateToken, SubjectController.delete)
subjectRoutes.patch('/:id', validateToken, SubjectController.update)

module.exports = subjectRoutes
