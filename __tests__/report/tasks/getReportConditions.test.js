const moment = require('moment')
const { sortDatesArray } = require('../../../src/utils')
const { getReportConditions } = require('../../../src/report/tasks')
const {
  Types: {
    ObjectId: generateObjectId
  }
} = require('mongoose')

describe('getReportConditions', () => {
  it('should return a query with finished equal to true when filters.status includes 2 (FINISHED)', () => {
    const filters = {
      user: generateObjectId().toString(),
      status: '2'
    }

    const result = getReportConditions({ filters })

    expect(result).toStrictEqual({
      user: filters.user,
      $or: [
        {
          finished: true
        }
      ]
    })
  })

  it('should return a query with finished equal to false and finalDate greater than NOW when filters.status includes 0 (IN PROGRESS)', () => {
    const filters = {
      user: generateObjectId().toString(),
      status: '0'
    }

    const result = getReportConditions({ filters })

    expect(result).toStrictEqual({
      user: filters.user,
      $or: [
        {
          finished: false,
          finalDate: {
            $gt: moment().startOf('day').toISOString()
          }
        }
      ]
    })
  })

  it('should return a query with finished equal to false and finalDate less than NOW when filters.status includes 1 (LATE)', () => {
    const filters = {
      user: generateObjectId().toString(),
      status: '1'
    }

    const result = getReportConditions({ filters })

    expect(result).toStrictEqual({
      user: filters.user,
      $or: [
        {
          finished: false,
          finalDate: {
            $lt: moment().endOf('day').toISOString()
          }
        }
      ]
    })
  })

  it('should return a query with finished equal to true when filters.status includes 2 (FINISHED) and OR conditions with finished equal to false and finalDate greater than and finalDate less than NOW when filters.status includes 0 (IN PROGRESS) and 1 (LATE), respectively', () => {
    const filters = {
      user: generateObjectId().toString(),
      status: '0,1,2'
    }

    const result = getReportConditions({ filters })

    expect(result).toStrictEqual({
      user: filters.user,
      $or: [
        {
          finished: true
        },
        {
          finished: false,
          finalDate: {
            $gt: moment().startOf('day').toISOString()
          }
        },
        {
          finished: false,
          finalDate: {
            $lt: moment().endOf('day').toISOString()
          }
        }
      ]
    })
  })

  it('should return a query with subject equal to subjectId when filters.subject is a valid ObjectId', () => {
    const subjectIds = []

    subjectIds.push(generateObjectId().toString())
    subjectIds.push(generateObjectId().toString())

    const filters = {
      user: generateObjectId().toString(),
      subject: subjectIds.join(',')
    }

    const result = getReportConditions({ filters })

    expect(result).toStrictEqual({
      user: filters.user,
      subject: {
        $in: subjectIds
      }
    })
  })

  it('should throw an error when filters.subject is not a valid ObjectId', () => {
    const objectId = generateObjectId().toString()

    const filters = {
      user: generateObjectId().toString(),
      subject: `${objectId}, 123`
    }

    expect(() => getReportConditions({ filters })).toThrow()
  })

  it('should return a query with finalDate greater than and finalDate less than NOW when filters.finalDate is a valid ISO date', () => {
    const filters = {
      user: generateObjectId().toString(),
      finalDate: '2021-01-01, 2021-03-10, 2021-05-31'
    }

    const datesArray = filters.finalDate.split(',')
    const sortDates = sortDatesArray(datesArray)

    const result = getReportConditions({ filters })

    expect(result).toStrictEqual({
      user: filters.user,
      finalDate: {
        $gte: moment(sortDates[0]).startOf('day').toISOString(),
        $lte: moment(sortDates[sortDates.length - 1]).endOf('day').toISOString()
      }
    })
  })

  it('should throw an error when filters.finalDate is not a valid ISO date', () => {
    const filters = {
      user: generateObjectId().toString(),
      finalDate: '2021-13-31'
    }

    expect(() => getReportConditions({ filters })).toThrow()
  })

  it('should return a query with all conditions when filters has all properties', () => {
    const subjectIds = []

    subjectIds.push(generateObjectId().toString())
    subjectIds.push(generateObjectId().toString())

    const filters = {
      user: generateObjectId().toString(),
      subject: subjectIds.join(','),
      finalDate: '2021-01-01, 2021-03-10, 2021-05-31',
      status: '0,1,2'
    }

    const datesArray = filters.finalDate.split(',')
    const sortDates = sortDatesArray(datesArray)

    const result = getReportConditions({ filters })

    expect(result).toStrictEqual({
      user: filters.user,
      subject: {
        $in: subjectIds
      },
      finalDate: {
        $gte: moment(sortDates[0]).startOf('day').toISOString(),
        $lte: moment(sortDates[sortDates.length - 1]).endOf('day').toISOString()
      },
      $or: [
        {
          finished: true
        },
        {
          finished: false,
          finalDate: {
            $gt: moment().startOf('day').toISOString()
          }
        },
        {
          finished: false,
          finalDate: {
            $lt: moment().endOf('day').toISOString()
          }
        }
      ]
    })
  })
})
