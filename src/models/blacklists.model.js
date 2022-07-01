const { Schema, model } = require('mongoose')

const BlacklistSchema = new Schema({
  token: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const BlacklistModel = model('Blacklists', BlacklistSchema)

module.exports = BlacklistModel
