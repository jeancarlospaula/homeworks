const Task = require('../models/tasks.model')

class TaskRepository {
  static async insert ({ name, user, subject, finalDate }) {
    const task = new Task({ name, user, subject, finalDate })
    return await task.save()
  }

  static async findOne (condition, projection) {
    const task = await Task.findOne(condition, projection).populate('subject', 'name')
    return task
  }

  static async findOneAndUpdate (condition, update, projection) {
    const task = await Task.findOneAndUpdate(condition, update, { new: true, projection })
    return task
  }

  static async find (condition, projection) {
    const tasks = await Task.find(condition, projection).populate('subject', 'name')
    return tasks
  }

  static async findOneAndDelete (condition, projection) {
    const task = await Task.findOneAndDelete(condition, projection)
    return task
  }
}

module.exports = TaskRepository
