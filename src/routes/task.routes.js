const { Router } = require('express')
const TasksController = require('../controllers/Task.controller')
const { validateToken } = require('../middlewares/validateToken')
const taskRoutes = Router()

taskRoutes.post('/create', validateToken, TasksController.create)

module.exports = taskRoutes
