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
}

module.exports = SubjectRepository
