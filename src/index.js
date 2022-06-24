require('dotenv').config()
const connectDB = require('./database/connection/connect')
const express = require('express')
const app = express()
const port = process.env.PORT || process.env.PORT_LOCALHOST

const start = async () => {
  await connectDB()
  app.listen(port, () => console.log(`Server active on port ${port}`))
}

start()
