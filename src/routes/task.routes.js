const { Router } = require('express')
const TasksController = require('../controllers/Task.controller')
const { validateToken } = require('../middlewares/validateToken')
const taskRoutes = Router()

taskRoutes.post('/create', validateToken, TasksController.create)
taskRoutes.get('/list', validateToken, TasksController.list)
taskRoutes.get('/:id', validateToken, TasksController.getById)
taskRoutes.delete('/:id', validateToken, TasksController.delete)

module.exports = taskRoutes
