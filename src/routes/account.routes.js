const { Router } = require('express')
const AccountController = require('../controllers/Account.controller')
const accountRoutes = Router()

accountRoutes.post('/register', AccountController.register)
accountRoutes.post('/confirm', AccountController.confirm)
accountRoutes.post('/confirm/:confirmationToken', AccountController.confirmAccount)

module.exports = accountRoutes
