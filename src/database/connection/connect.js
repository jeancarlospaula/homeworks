const mongoose = require('mongoose')

const connectDB = async () => {
  await mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Database connected'))
    .catch((error) => console.log('Error connecting to database: ', error))
}

module.exports = connectDB
