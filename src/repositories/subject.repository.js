const { SubjectsModel: Subject } = require('./../models')

class SubjectRepository {
  static async insert ({ user, name }) {
    const subject = new Subject({ user, name })
    return await subject.save()
  }

  static async findOne (condition, projection) {
    const subject = await Subject.findOne(condition, projection)
    return subject
  }

  static async findOneAndUpdate (condition, update, projection) {
    const subject = await Subject.findOneAndUpdate(condition, update, { new: true, projection })
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

  static async findByIdList (idList, projection) {
    const subjects = await Subject.find({ _id: { $in: idList } }, projection)
    return subjects
  }
}

module.exports = SubjectRepository
