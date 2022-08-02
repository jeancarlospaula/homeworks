// const checkBodySchema = require('../utils/bodySchema/checkBodySchema')
const { createSubjectSchema } = require('../utils/bodySchema/bodySchemas')
const checkBodySchema = require('../utils/bodySchema/checkBodySchema')
const errorManager = require('../utils/errors/errorManager')
const errorThrower = require('../utils/errors/errorThrower')
const Subject = require('../repositories/subject.repository')

class SubjectController {
  static async create (req, res) {
    try {
      const isInvalidBody = checkBodySchema({
        body: req.body,
        schema: createSubjectSchema
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

      return res.status(400).json(response)
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

      return res.status(400).json(response)
    }
  }
}

module.exports = SubjectController
