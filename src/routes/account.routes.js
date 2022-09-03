const { Router } = require('express')
const { AccountController } = require('../controllers')
const { validateToken } = require('../middlewares')
const accountRoutes = Router()

accountRoutes.post('/register', AccountController.register)
accountRoutes.post('/confirm', AccountController.confirm)
accountRoutes.patch('/confirm/', AccountController.confirmAccount)
accountRoutes.post('/reset/password', AccountController.resetPasswordEmail)
accountRoutes.patch('/reset/password/:resetPassToken', AccountController.resetPassword)
accountRoutes.post('/login', AccountController.login)
accountRoutes.post('/logout', AccountController.logout)
accountRoutes.get('/user', validateToken, AccountController.getUser)
accountRoutes.patch('/user', validateToken, AccountController.updateUser)

module.exports = accountRoutes
