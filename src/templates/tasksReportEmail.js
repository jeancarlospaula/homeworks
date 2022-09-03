const images = require('./images.js')

const htmlTasksReportEmail = ({ name }) => {
  return `<div>
      <p>Hi ${name}, here is your <b>PDF task report</b> attached.</p>
      <br/>
      <img src='${images.emailBanner}' alt='HomeWorks Logo' height='50'/>
      <br/>
      <br/>
      <p>This is an automated email, please do not reply.</p>
    </div>`
}

const textTasksReportEmail = ({ name }) => {
  return `Hi ${name} here is your <b>PDF task report</b> attached.\nThis is an automated email, please do not reply.`
}

module.exports = {
  htmlTasksReportEmail,
  textTasksReportEmail
}
