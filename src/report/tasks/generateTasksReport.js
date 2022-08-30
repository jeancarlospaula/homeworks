const { htmlTasksReportEmail, textTasksReportEmail } = require('../../templates/tasksReportEmail')
const { pdfGenerator } = require('./../../services/pdf/pdfGenerator')
const { getReportTemplate } = require('./getReportTemplate')

const generateTasksReport = ({ tasks, filters, userName, userEmail }) => {
  const template = getReportTemplate({ tasks, filters })

  const fonts = {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold'
    }
  }

  const params = {
    email: userEmail,
    subject: `${userName}, your tasks report is ready!`,
    text: textTasksReportEmail({ name: userName }),
    html: htmlTasksReportEmail({ name: userName }),
    attachments: [
      {
        filename: 'Tasks Report - HomeWorks.pdf',
        contentType: 'application/pdf'
      }
    ],
    type: 'Report of tasks'
  }

  return pdfGenerator({
    fonts,
    params,
    docDefinition: template
  })
}

module.exports = { generateTasksReport }
