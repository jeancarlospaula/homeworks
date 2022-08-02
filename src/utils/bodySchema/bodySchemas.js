const registerSchema = ['firstName', 'lastName', 'email', 'password']
const confirmEmailSchema = ['email']
const confirmAccountSchema = ['email', 'confirmationToken']
const resetPasswordEmailSchema = ['email']
const resetPasswordSchema = ['password']
const loginSchema = ['email', 'password']
const createSubjectSchema = ['name']

module.exports = {
  registerSchema,
  confirmEmailSchema,
  resetPasswordEmailSchema,
  resetPasswordSchema,
  loginSchema,
  confirmAccountSchema,
  createSubjectSchema
}
