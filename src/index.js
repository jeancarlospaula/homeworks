require('dotenv').config()
const connectDB = require('./database/connection/connectDB.js')
const express = require('express')
const routes = require('./routes/routes')
const app = express()
const port = process.env.PORT || process.env.PORT_LOCALHOST

const start = async () => {
  await connectDB()
  app.use('/', routes)
  app.listen(port, () => console.log(`Server active on port ${port}`))
}

start()
