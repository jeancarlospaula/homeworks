const { bodySchemas } = require('../../../src/utils')

describe('bodySchema', () => {
  it('should return the request body schemas correctly', () => {
    expect(bodySchemas).toStrictEqual({
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
    })
  })
})
