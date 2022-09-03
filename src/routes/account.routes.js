const { Router } = require('express')
const AccountController = require('../controllers/Account.controller')
const { validateToken } = require('../middlewares/validateToken')
const accountRoutes = Router()

accountRoutes.post('/register', AccountController.register)
accountRoutes.post('/confirm', AccountController.confirm)
accountRoutes.patch('/confirm/', AccountController.confirmAccount)
accountRoutes.post('/reset/password', AccountController.resetPasswordEmail)
accountRoutes.patch('/reset/password/:resetPassToken', AccountController.resetPassword)
accountRoutes.post('/login', AccountController.login)
accountRoutes.post('/logout', AccountController.logout)
accountRoutes.get('/user', validateToken, AccountController.getUser)

module.exports = accountRoutes
