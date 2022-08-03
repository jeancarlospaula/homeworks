const moment = require('moment')
const { createTaskSchema } = require('../utils/bodySchema/bodySchemas')
const checkBodySchema = require('../utils/bodySchema/checkBodySchema')
const errorManager = require('../utils/errors/errorManager')
const errorThrower = require('../utils/errors/errorThrower')
const { isValidObjectId } = require('mongoose')
const Subject = require('../repositories/subject.repository')
const Task = require('../repositories/task.repository')

class TaskController {
  static async create (req, res) {
    try {
      const isInvalidBody = checkBodySchema({
        body: req.body,
        schema: createTaskSchema
      })

      if (isInvalidBody.length) {
        errorThrower({
          message: {
            description: 'JSON sent is incomplete. There are missing required fields.',
            fields: isInvalidBody
          },
          statusCode: 400
        })
      }

      const {
        name,
        subject,
        finalDate
      } = req.body

      const isISODate = moment(finalDate, moment.ISO_8601).isValid()

      if (!isISODate) {
        errorThrower({
          message: 'finalDate is not a valid string in ISO 8601 format',
          statusCode: 400
        })
      }

      if (!isValidObjectId(subject)) {
        errorThrower({
          message: {
            description: 'Subject does not exist with the provided id',
            data: {
              id: subject
            }
          },
          statusCode: 400
        })
      }

      const subjectExists = await Subject.findOne({ _id: subject, user: req.user }, '-_id name')

      if (!subjectExists) {
        errorThrower({
          message: {
            description: 'Subject does not exist with the provided id',
            id: subject
          },
          statusCode: 400
        })
      }

      const task = await Task.insert({
        name,
        user: req.user,
        subject,
        finalDate
      })

      await Subject.pushTask({ _id: subject, user: req.user }, task._id)

      return res.status(201).json({
        message: 'Task created successfully',
        data: {
          id: task._id
        }
      })
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          error: {
            message: 'finalDate is not a valid string in ISO 8601 format'
          }
        })
      }

      const response = errorManager({
        error,
        genericMessage: 'Error creating task. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(500).json(response)
    }
  }
}

module.exports = TaskController