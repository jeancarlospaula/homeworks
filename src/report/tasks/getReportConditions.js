const moment = require('moment')
const { isValidObjectId } = require('mongoose')
const { tasksStatusList } = require('../../utils/enums/tasksStatusList')
const { sortDatesArray } = require('../../utils/sortDatesArray')
const errorThrower = require('./../../utils/errors/errorThrower')

const getReportConditions = ({ filters }) => {
  let conditions = {
    user: filters.user
  }

  const statusTasks = filters.status?.split(',')
  const subjectIds = filters.subject?.split(',')
  const finalDates = filters.finalDate?.split(',')

  if (statusTasks?.includes(tasksStatusList.enum.FINISHED.toString())) {
    conditions = {
      ...conditions,
      $or: [
        {
          finished: true
        }
      ]
    }
  }

  if (statusTasks?.includes(tasksStatusList.enum['IN PROGRESS'].toString())) {
    conditions = {
      ...conditions,
      $or: [
        ...(conditions.$or || []),
        {
          finished: false,
          finalDate: {
            $gt: moment().startOf('day').toISOString()
          }
        }
      ]
    }
  }

  if (statusTasks?.includes(tasksStatusList.enum.LATE.toString())) {
    conditions = {
      ...conditions,
      $or: [
        ...(conditions.$or || []),
        {
          finished: false,
          finalDate: {
            $lt: moment().endOf('day').toISOString()
          }
        }
      ]
    }
  }

  if (filters.subject && subjectIds?.length) {
    subjectIds.forEach(subject => {
      if (!isValidObjectId(subject)) {
        errorThrower({
          message: {
            description: 'Invalid subject id provided',
            data: {
              id: subject
            }
          },
          statusCode: 400
        })
      }
    })

    conditions = {
      ...conditions,
      subject: {
        $in: subjectIds
      }
    }
  }

  if (filters.finalDate && finalDates?.length) {
    finalDates.forEach(finalDate => {
      const isISODate = moment(finalDate, moment.ISO_8601).isValid()

      if (!isISODate) {
        errorThrower({
          message: {
            description: 'finalDate is not a valid string in ISO 8601 format',
            data: {
              finalDate
            }
          },
          statusCode: 400
        })
      }
    })

    const sortedDates = sortDatesArray(finalDates)

    const lowestFinalDate = moment(sortedDates[0]).startOf('day').toISOString()
    const highestFinalDate = moment(sortedDates[sortedDates.length - 1]).endOf('day').toISOString()

    conditions = {
      ...conditions,
      finalDate: {
        $gte: lowestFinalDate,
        $lte: highestFinalDate
      }
    }
  }

  return conditions
}

module.exports = { getReportConditions }
