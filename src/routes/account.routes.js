const { Router } = require('express')
const AccountController = require('../controllers/Account.controller')
const accountRoutes = Router()

accountRoutes.post('/register', AccountController.register)
accountRoutes.post('/confirm', AccountController.confirm)
accountRoutes.get('/confirm/:confirmationToken', AccountController.confirmAccount)
accountRoutes.post('/reset/password', AccountController.resetPasswordEmail)
accountRoutes.patch('/reset/password/:resetPassToken', AccountController.resetPassword)
accountRoutes.post('/login', AccountController.login)
accountRoutes.post('/logout', AccountController.logout)

module.exports = accountRoutes
