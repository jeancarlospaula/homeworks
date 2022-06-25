const { Router } = require('express')
const AccountController = require('../controllers/Account.controller')
const accountRoutes = Router()

accountRoutes.post('/register', AccountController.register)

module.exports = accountRoutes
