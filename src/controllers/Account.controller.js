const checkBodySchema = require('../utils/bodySchema/checkBodySchema')
const {
  registerSchema,
  confirmEmailSchema,
  resetPasswordEmailSchema,
  resetPasswordSchema,
  loginSchema,
  confirmAccountSchema
} = require('../utils/bodySchema/bodySchemas')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const errorManager = require('../utils/errors/errorManager')
const errorThrower = require('../utils/errors/errorThrower')
const UserRepository = require('../repositories/user.repository')
const AccountRepository = require('../repositories/account.repository')
const { v4: V4uuid } = require('uuid')
const { emailSender } = require('../services/email/emailSender')
const { textConfirmationEmail, htmlConfirmationEmail } = require('../templates/confirmationEmail')
const { textResetPassword, htmlResetPassWord } = require('../templates/resetPasswordEmail')
const checkTokenExpired = require('../utils/checkTokenExpired')
const BlacklistRepository = require('../repositories/blacklist.repository')
const randomNumber = require('random-number')

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

      const bcryptHash = await bcrypt.genSalt(12)
      const encryptedPassword = await bcrypt.hash(password, bcryptHash)

      const { _id: userId } = await UserRepository.insert({
        firstName,
        lastName,
        email,
        password: encryptedPassword
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

      const confirmationToken = randomNumber({ min: 100000, max: 999999, integer: true })

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
      const isInvalidBody = checkBodySchema({
        body: req.body,
        schema: confirmAccountSchema
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

      const { confirmationToken, email } = req.body

      const { _id: userId, firstName } = await UserRepository.findByEmail({ email })
      const account = await AccountRepository.confirmAccountByTokenAndEmail(confirmationToken.toString(), userId)

      if (!account) {
        errorThrower({
          message: {
            description: 'Error confirming account. Invalid account or token.',
            email,
            confirmationToken: confirmationToken.toString()
          },
          statusCode: 400
        })
      }

      return res.status(200).json(
        {
          message:
          {
            description: 'Account confirmed successfully.',
            email,
            firstName
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

  static async login (req, res) {
    try {
      const isInvalidBody = checkBodySchema({
        body: req.body,
        schema: loginSchema
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

      const { email, password } = req.body

      const user = await UserRepository.findByEmail({ email })

      if (!user) {
        errorThrower({
          message: {
            description: 'User not found with the email provided.',
            email
          },
          statusCode: 400
        })
      }

      const validPassword = await bcrypt.compare(password, user.password)

      if (!validPassword) {
        errorThrower({
          message: {
            description: 'Invalid password.',
            email
          },
          statusCode: 400
        })
      }

      const { confirmedEmail: isAccountEmailConfirmed } = await AccountRepository.findByUserId(user._id)

      if (!isAccountEmailConfirmed) {
        errorThrower({
          message: {
            description: 'Account not yet confirmed by email.',
            email
          },
          statusCode: 400
        })
      }

      const SECRET_JWT = process.env.SECRET_JWT

      const token = jwt.sign({
        user: user._is
      },
      SECRET_JWT,
      {
        expiresIn: '24h'
      })

      return res.status(200).json({ accessToken: token, firstName: user.firstName })
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error when logging in. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(400).json(response)
    }
  }

  static async logout (req, res) {
    try {
      const token = req.headers['x-access-token']

      if (!token) {
        errorThrower({
          message: {
            description: 'To logout, it is necessary to inform the x-access-token header.'
          },
          statusCode: 400
        })
      }

      const tokenInBlacklist = await BlacklistRepository.findOne({ token })

      if (!tokenInBlacklist) {
        await BlacklistRepository.insert({ token })
      }

      return res.status(200).json({ message: 'User successfully logged out' })
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error when logging out. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(400).json(response)
    }
  }
}

module.exports = AccountController
