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
}

module.exports = SubjectRepository
