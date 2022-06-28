const { htmlConfirmationEmail, textConfirmationEmail } = require('../../src/templates/confirmationEmail')
const { images } = require('../../src/templates/images/images.js')
const { env } = require('../../__mocks__/env/variables')

beforeEach(() => {
  jest.resetModules()
})

describe('confirmationEmail', () => {
  describe('textConfirmationEmail', () => {
    it('should correctly return the text email template', () => {
      const name = 'Test Name'
      const confirmationToken = '123-token-test'

      const textTemplate = textConfirmationEmail({
        name,
        confirmationToken
      })

      const link = `${env.ENV_URL}/account/confirm/${confirmationToken}`

      expect(textTemplate).toBe(`Hi ${name}, to confirm your account, visit the link below.\nLink: ${link}.\nThis is an automated email, please do not reply.`)
    })
  })
  describe('htmlConfirmationEmail', () => {
    it('should correctly return the html email template', () => {
      const name = 'Test Name'
      const confirmationToken = '123-token-test'

      const htmlTemplate = htmlConfirmationEmail({
        name,
        confirmationToken
      })

      const link = `${env.ENV_URL}/account/confirm/${confirmationToken}`

      expect(htmlTemplate).toBe(
      `<div>
      <p>Hi ${name}, to confirm your account,
        <a href='${link}'>click here</a>.
      </p>
      <p>Or access: <a href='${link}'>${link}</a></p>
      <img src='${images.emailBanner}' alt='HomeWorks Logo' height='50'/>
      <br/>
      <br/>
      <p>This is an automated email, please do not reply.</p>
    </div>`)
    })
  })
})
