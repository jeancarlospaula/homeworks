const nodemailer = require('nodemailer')
const { errorThrower } = require('../../utils')

const emailSender = async ({ email, subject, text, html, type, attachments }) => {
  let emailSent = false

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_AUTH,
      pass: process.env.EMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: `HomeWorks App <${process.env.EMAIL_AUTH}>`,
    to: email,
    subject,
    text,
    html,
    attachments
  })
    .then(_ => {
      console.log(`${type} email sent to ${email} via nodemailer`)
      emailSent = true
    })
    .catch(error => console.log(error))

  if (!emailSent) {
    errorThrower({
      message: `Error sending ${type.toLowerCase()} email via nodemailer. Try again later.`,
      statusCode: 400
    })
  }
}

module.exports = { emailSender }
