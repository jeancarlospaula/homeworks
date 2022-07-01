const {
  registerSchema,
  confirmEmailSchema,
  resetPasswordEmailSchema,
  resetPasswordSchema,
  loginSchema
} = require('../../../src/utils/bodySchema/bodySchemas')

describe('bodySchema', () => {
  it('should return the request body schemas correctly', () => {
    expect(registerSchema).toEqual(['firstName', 'lastName', 'email', 'password'])
    expect(confirmEmailSchema).toEqual(['email'])
    expect(resetPasswordEmailSchema).toEqual(['email'])
    expect(resetPasswordSchema).toEqual(['password'])
    expect(loginSchema).toEqual(['email', 'password'])
  })
})
