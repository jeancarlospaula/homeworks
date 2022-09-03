const errorManager = ({ error, genericMessage }) => {
  if (error.statusCode) {
    let message
    try {
      message = JSON.parse(error.message)
    } catch {
      message = error.message
    }

    return { error: { message } }
  }

  console.log(error)
  return { error: { message: genericMessage } }
}

module.exports = { errorManager }
