const jwt = require('jsonwebtoken')
const { BlacklistRepository: Blacklist } = require('../repositories')

const {
  errorManager,
  errorThrower
} = require('../utils')

const validateToken = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token']

    if (!token) {
      errorThrower({
        message: 'Valid x-access-token header is required',
        statusCode: 401
      })
    }

    const isTokenBlacklisted = await Blacklist.findOne({ token })

    if (isTokenBlacklisted) {
      errorThrower({
        message: 'Expired token',
        statusCode: 401
      })
    }

    const { user } = jwt.verify(token, process.env.SECRET_JWT)

    req.user = user

    next()
  } catch (error) {
    if (error.message === 'invalid token') {
      return res.status(401).json({
        error: {
          message: 'Valid x-access-token header is required'
        }
      })
    }

    if (error.message === 'jwt expired') {
      return res.status(401).json({
        error: {
          message: 'Expired token'
        }
      })
    }

    const response = errorManager({
      error,
      genericMessage: 'Error validating token. Try again later.'
    })

    if (error.statusCode) {
      return res.status(error.statusCode).json(response)
    }

    return res.status(400).json(response)
  }
}

module.exports = { validateToken }
