const { Schema, model, Types } = require('mongoose')

const AccountsSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'Users',
    required: true
  },
  confirmedEmail: {
    type: Boolean,
    default: false
  },
  refreshPassToken: {
    type: String
  },
  refreshPassTokenDate: {
    type: Date
  }
}, {
  timestamps: true
})

const AccountsModel = model('Accounts', AccountsSchema)

module.exports = AccountsModel
