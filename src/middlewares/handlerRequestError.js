const handlerRequestError = (error, req, res, next) => {
  if (error instanceof Error) {
    console.log(error)
    return res.status(error.status).json({ error: { message: error.message } })
  }
}

module.exports = { handlerRequestError }
