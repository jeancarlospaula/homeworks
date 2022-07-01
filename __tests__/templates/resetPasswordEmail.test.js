const { images } = require('../../src/templates/images/images.js')
const { htmlResetPassWord, textResetPassword } = require('../../src/templates/resetPasswordEmail.js')
const { env } = require('../../__mocks__/env/variables')

beforeEach(() => {
  jest.resetModules()
})

describe('resetPasswordEmail', () => {
  describe('textResetPassword', () => {
    it('should correctly return the text email template', () => {
      const name = 'Test Name'
      const resetPassToken = '123-token-test'

      const textTemplate = textResetPassword({
        name,
        resetPassToken
      })

      const link = `${env.ENV_URL}/account/reset/password/${resetPassToken}`

      expect(textTemplate).toBe(`Hi ${name}, to reset your password, visit the link below.\nLink: ${link}.\nThis is an automated email, please do not reply.`)
    })
  })
  describe('htmlResetPassWord', () => {
    it('should correctly return the html email template', () => {
      const name = 'Test Name'
      const resetPassToken = '123-token-test'

      const htmlTemplate = htmlResetPassWord({
        name,
        resetPassToken
      })

      const link = `${env.ENV_URL}/account/reset/password/${resetPassToken}`

      expect(htmlTemplate).toBe(`<div>
      <p>Hi ${name}, to reset your password,
        <a href='${link}'>click here</a>.
      </p>
      <p>Or access: <a href='${link}'>${link}</a></p>
      <p>Notice: This link is valid for two hours. If it expires, it will be necessary to perform the password reset process again.</p>
      <img src='${images.emailBanner}' alt='HomeWorks Logo' height='50'/>
      <br/>
      <br/>
      <p>This is an automated email, please do not reply.</p>
    </div>`)
    })
  })
})
