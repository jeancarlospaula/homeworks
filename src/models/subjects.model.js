const { Schema, model, Types } = require('mongoose')

const SubjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: Types.ObjectId,
    ref: 'Users',
    required: true
  }
}, {
  timestamps: true
})

const SubjectModel = model('Subjects', SubjectSchema)

module.exports = SubjectModel
