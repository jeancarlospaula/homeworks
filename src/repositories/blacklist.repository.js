const { BlacklistsModel: Blacklist } = require('./../models')

class BlacklistRepository {
  static async insert ({ token }) {
    const blacklist = new Blacklist({ token })
    return await blacklist.save()
  }

  static async findOne (condition) {
    const blacklist = await Blacklist.findOne(condition)
    return blacklist
  }
}

module.exports = BlacklistRepository
