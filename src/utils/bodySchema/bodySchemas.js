module.exports = {
  account: {
    register: ['firstName', 'lastName', 'email', 'password'],
    confirmEmail: ['email'],
    confirmAccount: ['email', 'confirmationToken'],
    resetPasswordEmail: ['email'],
    resetPassword: ['password'],
    login: ['email', 'password']
  },
  subject: {
    create: ['name'],
    update: ['name']
  },
  task: {
    create: ['name', 'subject', 'finalDate']
  }
}
