const { generateTasksReport } = require('./generateTasksReport')
const { getFooterMessage } = require('./getFooterMessage')
const { getReportConditions } = require('./getReportConditions')
const { getReportTemplate } = require('./getReportTemplate')

module.exports = {
  generateTasksReport,
  getFooterMessage,
  getReportConditions,
  getReportTemplate
}
