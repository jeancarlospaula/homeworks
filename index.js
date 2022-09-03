require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || process.env.PORT_LOCALHOST

const connectDB = require('./src/database/connection/connectDB.js')
const routes = require('./src/routes/routes')

const start = async () => {
  await connectDB()
  app.use('/', routes)
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' })
  })
  app.listen(port, () => console.log(`Server active on port ${port}`))
}

start()
