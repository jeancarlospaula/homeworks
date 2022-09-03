const { Router } = require('express')
const { TaskController } = require('../controllers')
const { validateToken } = require('../middlewares')
const taskRoutes = Router()

taskRoutes.post('/create', validateToken, TaskController.create)
taskRoutes.get('/list', validateToken, TaskController.list)
taskRoutes.get('/:id', validateToken, TaskController.getById)
taskRoutes.delete('/:id', validateToken, TaskController.delete)
taskRoutes.patch('/:id', validateToken, TaskController.update)

module.exports = taskRoutes
