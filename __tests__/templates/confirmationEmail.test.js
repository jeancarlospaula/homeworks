const { htmlConfirmationEmail, textConfirmationEmail } = require('../../src/templates/confirmationEmail')
const { images } = require('../../src/templates/images/images.js')

beforeEach(() => {
  jest.resetModules()
})

describe('confirmationEmail', () => {
  describe('textConfirmationEmail', () => {
    it('should correctly return the text email template', () => {
      const name = 'Test Name'
      const confirmationToken = '123456'

      const textTemplate = textConfirmationEmail({
        name,
        confirmationToken
      })

      expect(textTemplate).toBe(`Hi ${name}, here is your confirmation token.\n${confirmationToken}.\nThis is an automated email, please do not reply.`)
    })
  })
  describe('htmlConfirmationEmail', () => {
    it('should correctly return the html email template', () => {
      const name = 'Test Name'
      const confirmationToken = '123456'

      const htmlTemplate = htmlConfirmationEmail({
        name,
        confirmationToken
      })

      expect(htmlTemplate).toBe(
        `<div>
      <p>Hi ${name}, here is your confirmation token:</p>
      <br/>
      <p style="font-size: 25px; letter-spacing: 5px"><b>${confirmationToken}</b></p>
      <br/>
      <img src='${images.emailBanner}' alt='HomeWorks Logo' height='50'/>
      <br/>
      <br/>
      <p>This is an automated email, please do not reply.</p>
    </div>`)
    })
  })
})
