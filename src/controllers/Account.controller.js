const checkBodySchema = require('../utils/bodySchema/checkBodySchema')
const { registerSchema, confirmEmailSchema, resetPasswordEmailSchema, resetPasswordSchema } = require('../utils/bodySchema/bodySchemas')
const errorManager = require('../utils/errors/errorManager')
const errorThrower = require('../utils/errors/errorThrower')
const UserRepository = require('../repositories/user.repository')
const AccountRepository = require('../repositories/account.repository')
const { v4: V4uuid } = require('uuid')
const { emailSender } = require('../services/email/emailSender')
const { textConfirmationEmail, htmlConfirmationEmail } = require('../templates/confirmationEmail')
const { textResetPassword, htmlResetPassWord } = require('../templates/resetPasswordEmail')
const checkTokenExpired = require('../utils/checkTokenExpired')

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

      const user = await UserRepository.findByEmail({ email })

      if (!user) {
        errorThrower({
          message: {
            description: 'There is no user registered with this email',
            email
          },
          statusCode: 400
        })
      }

      const { _id: accountId } = await AccountRepository.findByUserId(user._id)

      const confirmationToken = V4uuid()

      await AccountRepository.updateConfirmationTokenById({
        accountId,
        confirmationToken
      })

      await emailSender({
        email,
        subject: `${user.firstName}, confirm your account`,
        text: textConfirmationEmail({ name: user.firstName, confirmationToken }),
        html: htmlConfirmationEmail({ name: user.firstName, confirmationToken }),
        type: 'Confirmation'
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

      const account = await AccountRepository.confirmAccountByToken(confirmationToken)

      if (!account) {
        errorThrower({
          message: {
            description: 'Error confirming account. Invalid Token.',
            invalidToken: confirmationToken
          },
          statusCode: 400
        })
      }

      const { email } = await UserRepository.findById(account.user)

      return res.status(200).json(
        {
          message:
          {
            description: 'Account confirmed successfully.',
            email
          }
        })
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error confirming account. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(400).json(response)
    }
  }

  static async resetPasswordEmail (req, res) {
    try {
      const isInvalidBody = checkBodySchema({
        body: req.body,
        schema: resetPasswordEmailSchema
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

      const user = await UserRepository.findByEmail({ email })

      if (!user) {
        errorThrower({
          message: {
            description: 'There is no user registered with this email',
            email
          },
          statusCode: 400
        })
      }

      const resetPassToken = V4uuid()

      await AccountRepository.updateAccountByUserId({
        user: user._id,
        fields: {
          resetPassToken,
          resetPassTokenDate: new Date()
        }
      })

      await emailSender({
        email,
        subject: `${user.firstName}, reset your password`,
        text: textResetPassword({ name: user.firstName, resetPassToken }),
        html: htmlResetPassWord({ name: user.firstName, resetPassToken }),
        type: 'Password reset'
      })

      return res.status(200).json(
        {
          message: {
            description: 'Password reset email sent',
            email
          }
        })
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error sending password reset email. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(400).json(response)
    }
  }

  static async resetPassword (req, res) {
    try {
      const { resetPassToken } = req.params

      const isInvalidBody = checkBodySchema({
        body: req.body,
        schema: resetPasswordSchema
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

      const { password } = req.body

      const account = await AccountRepository.findOne({ resetPassToken })

      if (!account) {
        errorThrower({
          message: {
            description: 'Error resetting password. Invalid Token.',
            invalidToken: resetPassToken
          },
          statusCode: 400
        })
      }

      const isTokenExpired = checkTokenExpired({ tokenDate: account.resetPassTokenDate, durationToken: 2 })

      if (isTokenExpired) {
        errorThrower({
          message: {
            description: 'The password reset token has expired. Try generating another token.'
          },
          statusCode: 400
        })
      }

      const { email } = await UserRepository.findByIdAndUpdate(account.user, { password })

      await AccountRepository.deleteResetPassword(resetPassToken)

      return res.status(200).json(
        {
          message:
          {
            description: 'Password reset successfully.',
            email
          }
        })
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error resetting password. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(400).json(response)
    }
  }
}

module.exports = AccountController
