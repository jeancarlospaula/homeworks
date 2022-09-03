const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { v4: V4uuid } = require('uuid')
const randomNumber = require('random-number')

const templates = require('../templates')
const { emailSender } = require('../services/email/emailSender')

const {
  checkBodySchema,
  bodySchemas,
  errorManager,
  errorThrower,
  checkTokenExpired
} = require('../utils')

const {
  UserRepository,
  AccountRepository,
  BlacklistRepository
} = require('../repositories')

class AccountController {
  static async register (req, res) {
    try {
      const isInvalidBody = checkBodySchema({
        body: req.body,
        schema: bodySchemas.account.register
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
        schema: bodySchemas.account.confirmEmail
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
          message: 'There is no user registered with the provided email.',
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
        subject: `${user.firstName}, confirm your account!`,
        text: templates.text.confirmationEmail({ name: user.firstName, confirmationToken }),
        html: templates.html.confirmationEmail({ name: user.firstName, confirmationToken }),
        type: 'Confirmation'
      })

      return res.status(200).json(
        {
          message: 'Account confirmation email sent'
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
        schema: bodySchemas.account.confirmAccount
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

      const user = await UserRepository.findByEmail({ email })

      if (!user) {
        errorThrower({
          message: 'Error confirming account. Invalid email or token.',
          statusCode: 400
        })
      }

      const account = await AccountRepository.findByUserId(user._id)

      if (account?.confirmedEmail) {
        errorThrower({
          message: 'Account already confirmed.',
          statusCode: 400
        })
      }

      const accountUpdated = await AccountRepository.confirmAccountByTokenAndEmail(confirmationToken.toString(), user._id)

      if (!accountUpdated) {
        errorThrower({
          message: 'Error confirming account. Invalid email or token.',
          statusCode: 400
        })
      }

      return res.status(200).json({
        message: 'Account confirmed successfully.'
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
        schema: bodySchemas.account.resetPasswordEmail
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
          message: 'There is no user registered with the provided email.',
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
        subject: `${user.firstName}, reset your password!`,
        text: templates.text.resetPasswordEmail({ name: user.firstName, resetPassToken }),
        html: templates.html.resetPasswordEmail({ name: user.firstName, resetPassToken }),
        type: 'Password reset'
      })

      return res.status(200).json({
        message: 'Password reset email sent.'
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
        schema: bodySchemas.account.resetPassword
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
          message: 'Error resetting password. Invalid Token.',
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

      await UserRepository.findByIdAndUpdate(account.user, { password })

      await AccountRepository.deleteResetPassword(resetPassToken)

      return res.status(200).json({
        message: 'Password reset successfully.'
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
        schema: bodySchemas.account.login
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
          message: 'Incorrect email or password.',
          statusCode: 401
        })
      }

      const validPassword = await bcrypt.compare(password, user.password)

      if (!validPassword) {
        errorThrower({
          message: 'Incorrect email or password.',
          statusCode: 401
        })
      }

      const { confirmedEmail: isAccountEmailConfirmed } = await AccountRepository.findByUserId(user._id)

      if (!isAccountEmailConfirmed) {
        errorThrower({
          message: 'Account not yet confirmed by email.',
          statusCode: 400
        })
      }

      const { SECRET_JWT } = process.env

      const token = jwt.sign({
        user: user._id
      },
      SECRET_JWT,
      {
        expiresIn: '24h'
      })

      return res.status(200).json({ accessToken: token })
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
          message: 'To logout, it is necessary to inform the x-access-token header.',
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

  static async getUser (req, res) {
    try {
      const { user: userId } = req

      const user = await UserRepository.findById(userId, 'firstName lastName email')

      if (!user) {
        errorThrower({
          message: 'User not found.',
          statusCode: 404
        })
      }

      return res.status(200).json(user)
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error getting user. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(400).json(response)
    }
  }

  static async updateUser (req, res) {
    try {
      const body = {
        firstName: req.body.firstName,
        lastName: req.body.lastName
      }

      const newData = {}

      if (body.firstName) newData.firstName = body.firstName

      if (body.lastName) newData.lastName = body.lastName

      if (!newData.firstName && !newData.lastName) {
        errorThrower({
          message: 'Not enough data to update user.',
          statusCode: 400
        })
      }

      const { user: userId } = req

      const user = await UserRepository.findByIdAndUpdate(userId, newData)

      if (!user) {
        errorThrower({
          message: 'User not found.',
          statusCode: 404
        })
      }

      return res.status(200).json({ message: 'User updated successfully.' })
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error updating user. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(400).json(response)
    }
  }
}

module.exports = AccountController
