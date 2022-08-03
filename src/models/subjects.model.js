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
  },
  tasks: [{
    type: Types.ObjectId,
    ref: 'Tasks'
  }]
}, {
  timestamps: true
})

const SubjectModel = model('Subjects', SubjectSchema)

module.exports = SubjectModel
