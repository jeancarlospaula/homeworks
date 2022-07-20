const { images } = require('./images/images.js')

const htmlConfirmationEmail = ({ name, confirmationToken }) => {
  return `<div>
      <p>Hi ${name}, here is your confirmation token:</p>
      <br/>
      <p style="font-size: 25px; letter-spacing: 5px"><b>${confirmationToken}</b></p>
      <br/>
      <img src='${images.emailBanner}' alt='HomeWorks Logo' height='50'/>
      <br/>
      <br/>
      <p>This is an automated email, please do not reply.</p>
    </div>`
}

const textConfirmationEmail = ({ name, confirmationToken }) => {
  return `Hi ${name}, here is your confirmation token.\n${confirmationToken}.\nThis is an automated email, please do not reply.`
}

module.exports = { htmlConfirmationEmail, textConfirmationEmail }
