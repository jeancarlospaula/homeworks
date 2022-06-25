const Account = require('../models/accounts.model')

class AccountRepository {
  static async insert ({ userId }) {
    const account = new Account({ user: userId })
    const newAccount = await account.save()
    return newAccount
  }
}

module.exports = AccountRepository
