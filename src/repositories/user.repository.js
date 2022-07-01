const User = require('../models/users.model')

class UserRepository {
  static async insert (userObj) {
    const user = new User(userObj)
    const newUser = await user.save()
    return newUser
  }

  static async findById (id) {
    const user = User.findById(id)
    return user
  }

  static async findByIdAndUpdate (id, update) {
    const user = User.findByIdAndUpdate(id, update)
    return user
  }

  static async findByEmail ({ email }) {
    const user = User.findOne({ email })
    return user
  }
}

module.exports = UserRepository
