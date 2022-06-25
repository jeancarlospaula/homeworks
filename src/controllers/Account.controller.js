const checkBodySchema = require('../utils/bodySchema/checkBodySchema')
const { registerSchema } = require('../utils/bodySchema/bodySchemas')
const errorManager = require('../utils/errors/errorManager')
const errorThrower = require('../utils/errors/errorThrower')
const UserRepository = require('../repositories/user.repository')
const AccountRepository = require('../repositories/account.repository')

class AccountController {
  static async register (req, res) {
    try {
      const isInvalidBody = checkBodySchema({
        body: req.body,
        schema: registerSchema
      })

      if (isInvalidBody.length) {
        errorThrower({
          message: {
            description: 'JSON sent is incomplete. There are missing required fields.',
            fields: isInvalidBody
          },
          statusCode: 400
        })
      }

      const {
        firstName,
        lastName,
        email,
        password
      } = req.body

      const userAlreadyExists = await UserRepository.findByEmail({ email })

      if (userAlreadyExists) {
        errorThrower({
          message: 'User already existing for informed email.',
          statusCode: 400
        })
      }

      const { _id: userId } = await UserRepository.insert({
        firstName,
        lastName,
        email,
        password
      })

      await AccountRepository.insert({ userId })

      return res.status(201).json(
        {
          message:
          {
            description: 'User created successfully',
            user: { firstName, lastName, email }
          }
        })
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error registering user. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(400).json(response)
    }
  }
}

module.exports = AccountController
