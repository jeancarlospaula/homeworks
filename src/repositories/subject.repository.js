const Subject = require('../models/subjects.model')

class SubjectRepository {
  static async insert ({ user, name }) {
    const subject = new Subject({ user, name })
    return await subject.save()
  }

  static async findOne (condition, projection) {
    const subject = await Subject.findOne(condition, projection)
    return subject
  }

  static async find (condition, projection) {
    const subjects = await Subject.find(condition, projection)
    return subjects
  }

  static async findOneAndDelete (condition, projection) {
    const subject = await Subject.findOneAndDelete(condition, projection)
    return subject
  }

  static async pushTask (condition, taskId) {
    const subject = await Subject.updateOne(condition, { $push: { tasks: taskId } })
    return subject
  }

  static async pullTask (condition, taskId) {
    const subject = await Subject.updateOne(condition, { $pull: { tasks: taskId } })
    return subject
  }
}

module.exports = SubjectRepository
