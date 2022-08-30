const Task = require('../repositories/task.repository')
const User = require('../repositories/user.repository')
const Subject = require('../repositories/subject.repository')
const errorManager = require('../utils/errors/errorManager')
const { getReportConditions } = require('../report/tasks/getReportConditions')
const { generateTasksReport } = require('../report/tasks/generateTasksReport')
const { checkValidLanguages } = require('../utils/checkValidLanguages')
const { checkValidStatusIds } = require('../utils/checkValidStatusIds')

class ReportController {
  static async generate (req, res) {
    try {
      let filters = {
        user: req.user,
        status: req.query.status,
        subject: req.query.subject,
        finalDate: req.query.finalDate,
        language: req.query.language
      }

      if (filters.language) checkValidLanguages({ language: filters.language })

      const status = filters.status?.split(',')
      if (filters.status && status?.length) checkValidStatusIds({ statusArray: status })

      const conditions = getReportConditions({ filters })

      const tasks = await Task.find(conditions, '-user -createdAt -updatedAt -__v')

      if (!tasks.length) {
        return res.status(400).json({
          message: 'No tasks found with the provided filters'
        })
      }

      const subjectList = filters.subject?.split(',')
      let subjectNames = []

      if (filters.subject && subjectList?.length) {
        const subject = await Subject.findByIdList(subjectList, '-_id name')
        subjectNames = subject.map(subject => subject.name)
      }

      const user = await User.findById(req.user, 'firstName email')

      filters = {
        ...filters,
        subject: subjectNames
      }

      await generateTasksReport({
        tasks,
        filters,
        userName: user.firstName,
        userEmail: user.email
      })

      return res.status(200).json({
        message: 'PDF report sent successfully to email.'
      })
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error generating report. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(500).json(response)
    }
  }
}

module.exports = ReportController
