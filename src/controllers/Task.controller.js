const moment = require('moment')
const { isValidObjectId } = require('mongoose')

const {
  errorManager,
  errorThrower,
  checkBodySchema,
  bodySchemas
} = require('../utils')

const {
  TaskRepository: Task,
  SubjectRepository: Subject
} = require('../repositories')

class TaskController {
  static async create (req, res) {
    try {
      const isInvalidBody = checkBodySchema({
        body: req.body,
        schema: bodySchemas.task.create
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
        finalDate: moment(finalDate).endOf('day').toISOString()
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

  static async list (req, res) {
    try {
      const { user } = req

      const tasks = await Task.find({ user }, '-user -createdAt -updatedAt -__v')

      return res.status(200).json(tasks)
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error listing tasks. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(500).json(response)
    }
  }

  static async getById (req, res) {
    try {
      const { user } = req
      const { id } = req.params

      if (!isValidObjectId(id)) {
        errorThrower({
          message: {
            description: 'Task not found with id provided.',
            data: { id }
          },
          statusCode: 404
        })
      }

      const task = await Task.findOne({ _id: id, user }, '-user -createdAt -updatedAt -__v')

      if (!task) {
        errorThrower({
          message: {
            description: 'Task not found with id provided.',
            id
          },
          statusCode: 404
        })
      }

      return res.status(200).json(task)
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error getting task. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(500).json(response)
    }
  }

  static async delete (req, res) {
    try {
      const { user } = req
      const { id } = req.params

      if (!isValidObjectId(id)) {
        errorThrower({
          message: {
            description: 'Task not found with id provided.',
            data: { id }
          },
          statusCode: 404
        })
      }

      const task = await Task.findOne({ _id: id, user }, '-user -createdAt -updatedAt -__v')

      if (!task) {
        errorThrower({
          message: {
            description: 'Task not found with id provided.',
            id
          },
          statusCode: 404
        })
      }

      await Subject.pullTask({ _id: task.subject._id, user }, task._id)
      await Task.findOneAndDelete({ _id: id, user })

      return res.status(200).json({
        message: 'Task deleted successfully'
      })
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error deleting task. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(500).json(response)
    }
  }

  static async update (req, res) {
    try {
      const { user } = req
      const { id } = req.params

      if (!isValidObjectId(id)) {
        errorThrower({
          message: {
            description: 'Task not found with id provided.',
            data: { id }
          },
          statusCode: 404
        })
      }

      const task = await Task.findOne({ _id: id, user }, 'subject')

      if (!task) {
        errorThrower({
          message: {
            description: 'Task not found with id provided.',
            id
          },
          statusCode: 404
        })
      }

      const newData = {
        name: req.body.name,
        subject: req.body.subject,
        finalDate: req.body.finalDate,
        finished: req.body.finished
      }

      Object
        .keys(newData)
        .forEach(
          key =>
            newData[key] === undefined && delete newData[key]
        )

      if (newData.finalDate) {
        const isISODate = moment(newData.finalDate, moment.ISO_8601).isValid()

        if (!isISODate) {
          errorThrower({
            message: 'finalDate is not a valid string in ISO 8601 format',
            statusCode: 400
          })
        }
      }

      if (newData.subject) {
        if (!isValidObjectId(newData.subject)) {
          errorThrower({
            message: {
              description: 'Subject does not exist with the provided id',
              data: {
                id: newData.subject
              }
            },
            statusCode: 400
          })
        }

        const subjectExists = await Subject.findOne({ _id: newData.subject, user }, '-_id name')

        if (!subjectExists) {
          errorThrower({
            message: {
              description: 'Subject does not exist with the provided id',
              id: newData.subject
            },
            statusCode: 400
          })
        }

        await Subject.pullTask({ _id: task.subject._id, user }, id)
        await Subject.pushTask({ _id: newData.subject, user }, id)
      }

      await Task.findOneAndUpdate({ _id: id, user }, newData)

      return res.status(200).json({
        message: 'Task updated successfully'
      })
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error updating task. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(500).json(response)
    }
  }
}

module.exports = TaskController
