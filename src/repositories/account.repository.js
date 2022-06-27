const Account = require('../models/accounts.model')

class AccountRepository {
  static async insert ({ userId, confirmationToken }) {
    const account = new Account({ user: userId, confirmationToken })
    const newAccount = await account.save()
    return newAccount
  }

  static async findByUserId (userId) {
    const account = await Account.findOne({ user: userId })
    return account
  }

  static async updateConfirmationTokenById ({ accountId, confirmationToken }) {
    const account = await Account.findByIdAndUpdate(accountId, { confirmationToken }, { new: true })
    return account
  }

  static async confirmAccountByToken (confirmationToken) {
    const account = await Account.findOneAndUpdate({ confirmationToken }, { confirmedEmail: true }, { new: true })
    return account
  }
}

module.exports = AccountRepository
