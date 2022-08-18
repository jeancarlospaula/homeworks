require('dotenv').config()
const connectDB = require('./src/database/connection/connectDB.js')
const express = require('express')
const routes = require('./src/routes/routes')
const app = express()
const port = process.env.PORT || process.env.PORT_LOCALHOST

const start = async () => {
  await connectDB()
  app.use('/', routes)
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' })
  })
  app.listen(port, () => console.log(`Server active on port ${port}`))
}

start()
