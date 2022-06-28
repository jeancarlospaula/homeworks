const { images } = require('./images/images.js')

const htmlConfirmationEmail = ({ name, confirmationToken }) => {
  const link = `${process.env.ENV_URL}/account/confirm/${confirmationToken}`
  return `<div>
      <p>Hi ${name}, to confirm your account,
        <a href='${link}'>click here</a>.
      </p>
      <p>Or access: <a href='${link}'>${link}</a></p>
      <img src='${images.emailBanner}' alt='HomeWorks Logo' height='50'/>
      <br/>
      <br/>
      <p>This is an automated email, please do not reply.</p>
    </div>`
}

const textConfirmationEmail = ({ name, confirmationToken }) => {
  return `Hi ${name}, to confirm your account, visit the link below.\nLink: ${process.env.ENV_URL}/account/confirm/${confirmationToken}.\nThis is an automated email, please do not reply.`
}

module.exports = { htmlConfirmationEmail, textConfirmationEmail }
