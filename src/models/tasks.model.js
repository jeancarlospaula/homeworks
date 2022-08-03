const { Schema, model, Types } = require('mongoose')

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: Types.ObjectId,
    ref: 'Users',
    required: true
  },
  subject: {
    type: Types.ObjectId,
    ref: 'Subjects',
    required: true
  },
  finalDate: {
    type: Date,
    required: true
  },
  finished: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
})

const TasksModel = model('Tasks', TaskSchema)

module.exports = TasksModel
