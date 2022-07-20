const registerSchema = ['firstName', 'lastName', 'email', 'password']
const confirmEmailSchema = ['email']
const confirmAccountSchema = ['email', 'confirmationToken']
const resetPasswordEmailSchema = ['email']
const resetPasswordSchema = ['password']
const loginSchema = ['email', 'password']

module.exports = {
  registerSchema,
  confirmEmailSchema,
  resetPasswordEmailSchema,
  resetPasswordSchema,
  loginSchema,
  confirmAccountSchema
}
