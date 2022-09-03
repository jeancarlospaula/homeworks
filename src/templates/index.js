const images = require('./images')
const { htmlConfirmationEmail, textConfirmationEmail } = require('./confirmationEmail')
const { htmlResetPasswordEmail, textResetPasswordEmail } = require('./resetPasswordEmail')
const { htmlTasksReportEmail, textTasksReportEmail } = require('./tasksReportEmail')

module.exports = {
  images,
  html: {
    confirmationEmail: htmlConfirmationEmail,
    resetPasswordEmail: htmlResetPasswordEmail,
    tasksReportEmail: htmlTasksReportEmail
  },
  text: {
    confirmationEmail: textConfirmationEmail,
    resetPasswordEmail: textResetPasswordEmail,
    tasksReportEmail: textTasksReportEmail
  }
}
