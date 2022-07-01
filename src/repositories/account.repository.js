const Account = require('../models/accounts.model')

class AccountRepository {
  static async insert ({ userId, confirmationToken }) {
    const account = new Account({ user: userId, confirmationToken })
    const newAccount = await account.save()
    return newAccount
  }

  static async findOne (condition) {
    const account = await Account.findOne(condition)
    return account
  }

  static async findByUserId (userId) {
    const account = await Account.findOne({ user: userId })
    return account
  }

  static async updateAccountByUserId ({ user, fields }) {
    const account = await Account.findOneAndUpdate({ user }, fields, { new: true })
    return account
  }

  static async updateConfirmationTokenById ({ accountId, confirmationToken }) {
    const account = await Account.findByIdAndUpdate(accountId, { confirmationToken }, { new: true })
    return account
  }

  static async confirmAccountByToken (confirmationToken) {
    const deleteFields = {
      confirmationToken: 1
    }
    const account = await Account.findOneAndUpdate({ confirmationToken }, { $set: { confirmedEmail: true }, $unset: deleteFields }, { new: true })
    return account
  }

  static async deleteResetPassword (resetPassToken) {
    const deleteFields = {
      resetPassToken: 1,
      resetPassTokenDate: 1
    }
    const account = await Account.findOneAndUpdate({ resetPassToken }, { $unset: deleteFields }, { new: true })
    return account
  }
}

module.exports = AccountRepository
