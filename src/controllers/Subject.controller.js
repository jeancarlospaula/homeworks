const { isValidObjectId } = require('mongoose')
const { SubjectRepository: Subject } = require('../repositories')

const {
  checkBodySchema,
  errorManager,
  errorThrower,
  bodySchemas
} = require('../utils')

class SubjectController {
  static async create (req, res) {
    try {
      const isInvalidBody = checkBodySchema({
        body: req.body,
        schema: bodySchemas.subject.create
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

      const { name } = req.body

      const data = {
        name,
        user: req.user
      }

      const subjectAlreadyExists = await Subject.findOne(data, '-_id name')

      if (subjectAlreadyExists) {
        errorThrower({
          message: 'Subject already exists with this name',
          statusCode: 400
        })
      }

      const subject = await Subject.insert(data)

      return res.status(201).json({
        message: 'Subject created successfully',
        data: {
          id: subject._id
        }
      })
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error creating subject. Try again later.'
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

      const subjects = await Subject.find({ user }, 'name')

      return res.status(200).json(subjects)
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error when listing subjects. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(500).json(response)
    }
  }

  static async getById (req, res) {
    try {
      const { id } = req.params

      if (!isValidObjectId(id)) {
        errorThrower({
          message: {
            description: 'Subject not found with id provided.',
            data: { id }
          },
          statusCode: 404
        })
      }

      const { user } = req

      const subject = await Subject.findOne({ _id: id, user }, 'name')

      if (!subject) {
        errorThrower({
          message: {
            description: 'Subject not found with id provided.',
            data: { id }
          },
          statusCode: 404
        })
      }

      return res.status(200).json(subject)
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error when getting subject by id. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(500).json(response)
    }
  }

  static async delete (req, res) {
    try {
      const { id } = req.params

      if (!isValidObjectId(id)) {
        errorThrower({
          message: {
            description: 'Subject not found with id provided.',
            data: { id }
          },
          statusCode: 404
        })
      }

      const { user } = req

      const subject = await Subject.findOne({ _id: id, user }, 'name tasks')

      const subjectTasks = subject.tasks?.length

      if (subjectTasks) {
        errorThrower({
          message: {
            description: `Subject has ${subjectTasks} tasks related to it. Not is possible to delete it.`,
            data: {
              id,
              tasks: subject.tasks
            }
          },
          statusCode: 400
        })
      }

      const subjectDeleted = await Subject.findOneAndDelete({ _id: id, user })

      if (!subjectDeleted) {
        errorThrower({
          message: {
            description: 'Subject not found with id provided.',
            data: { id }
          },
          statusCode: 404
        })
      }

      return res.status(200).json({ message: 'Subject deleted successfully' })
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error when deleting subject by id. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(500).json(response)
    }
  }

  static async update (req, res) {
    try {
      const { id } = req.params

      const isInvalidBody = checkBodySchema({
        body: req.body,
        schema: bodySchemas.subject.update
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

      if (!isValidObjectId(id)) {
        errorThrower({
          message: {
            description: 'Subject not found with id provided.',
            data: { id }
          },
          statusCode: 404
        })
      }

      const { user } = req
      const { name } = req.body

      const subject = await Subject.findOneAndUpdate({ _id: id, user }, { name }, 'name')

      if (!subject) {
        errorThrower({
          message: {
            description: 'Subject not found with id provided.',
            data: { id }
          },
          statusCode: 404
        })
      }

      return res.status(200).json({ message: 'Subject updated successfully' })
    } catch (error) {
      const response = errorManager({
        error,
        genericMessage: 'Error when updating subject by id. Try again later.'
      })

      if (error.statusCode) {
        return res.status(error.statusCode).json(response)
      }

      return res.status(500).json(response)
    }
  }
}

module.exports = SubjectController
