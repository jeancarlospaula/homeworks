const checkBodySchema = require('../utils/bodySchema/checkBodySchema')
const { registerSchema, confirmEmailSchema } = require('../utils/bodySchema/bodySchemas')
const errorManager = require('../utils/errors/errorManager')
const errorThrower = require('../utils/errors/errorThrower')
const UserRepository = require('../repositories/user.repository')
const AccountRepository = require('../repositories/account.repository')
const { v4: V4uuid } = require('uuid')
const { updateConfirmationTokenById } = require('../repositories/account.repository')

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

      await AccountRepository.insert({ userId, confirmationToken: V4uuid() })

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

  static async confirm (req, res) {
    try {
      const isInvalidBody = checkBodySchema({
        body: req.body,
        schema: confirmEmailSchema
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

      const { email } = req.body

      const userExists = await UserRepository.findByEmail({ email })

      if (!userExists) {
        errorThrower({
          message: {
            description: 'There is no user registered with this email',
            email
          },
          statusCode: 400
        })
      }

      const { _id: accountId } = await AccountRepository.findByUserId(userExists._id)

      await updateConfirmationTokenById({
        accountId,
        confirmationToken: V4uuid()
      })

      return res.status(200).json(
        {
          message: {
            description: 'Account confirmation email sent',
            email
          }
        })
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error sending account confirmation email. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(400).json(response)
    }
  }

  static async confirmAccount (req, res) {
    try {
      const { confirmationToken } = req.params

      const accountExists = await AccountRepository.confirmAccountByToken(confirmationToken)

      if (!accountExists) {
        errorThrower({
          message: {
            description: 'Error confirming account. Invalid Token.',
            invalidToken: confirmationToken
          },
          statusCode: 400
        })
      }

      return res.status(200).json(
        {
          message:
          {
            description: 'Account confirmed successfully.'
          }
        })
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error sending account confirmation email. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(400).json(response)
    }
  }
}

module.exports = AccountController
