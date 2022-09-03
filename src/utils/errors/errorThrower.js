const errorThrower = ({ message, statusCode }) => {
  message = JSON.stringify(message)
  const error = new Error(message)
  error.statusCode = statusCode
  throw error
}

module.exports = { errorThrower }
