const { images } = require('./images/images.js')

const htmlResetPassWord = ({ name, resetPassToken }) => {
  const link = `${process.env.ENV_URL}/account/reset/password/${resetPassToken}`
  return `<div>
      <p>Hi ${name}, to reset your password,
        <a href='${link}'>click here</a>.
      </p>
      <p>Or access: <a href='${link}'>${link}</a></p>
      <p>Notice: This link is valid for two hours. If it expires, it will be necessary to perform the password reset process again.</p>
      <img src='${images.emailBanner}' alt='HomeWorks Logo' height='50'/>
      <br/>
      <br/>
      <p>This is an automated email, please do not reply.</p>
    </div>`
}

const textResetPassword = ({ name, resetPassToken }) => {
  const link = `${process.env.ENV_URL}/account/reset/password/${resetPassToken}`
  return `Hi ${name}, to reset your password, visit the link below.\nLink: ${link}.\nThis is an automated email, please do not reply.`
}

module.exports = { htmlResetPassWord, textResetPassword }
