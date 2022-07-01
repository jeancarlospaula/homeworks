const Blacklist = require('../models/blacklists.model')

class BlacklistRepository {
  static async insert ({ token }) {
    const blacklist = new Blacklist({ token })
    await blacklist.save()
  }

  static async findOne (condition) {
    const blacklist = Blacklist.findOne(condition)
    return blacklist
  }
}

module.exports = BlacklistRepository
