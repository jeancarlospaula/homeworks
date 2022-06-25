const User = require('../models/users.model')

class UserRepository {
  static async insert (userObj) {
    const user = new User(userObj)
    const newUser = await user.save()
    return newUser
  }

  static async findByEmail ({ email }) {
    const user = User.findOne({ email })
    return user
  }
}

module.exports = UserRepository
