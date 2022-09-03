const { sortDatesArray } = require('./../../src/utils')

describe('sortDatesArray', () => {
  it('should return the correct sorted array', () => {
    // eslint-disable-next-line no-sparse-arrays
    const datesArray = ['2021-01-01T12:00:00.000Z', '2021-01-01T09:00:00.000Z', '2021-01-02T12:00:00.000Z', , '2021-01-03T12:00:00.000Z']

    const sortedDatesArray = sortDatesArray(datesArray)

    console.log(sortedDatesArray)

    expect(sortedDatesArray).toStrictEqual(['2021-01-01T09:00:00.000Z', '2021-01-01T12:00:00.000Z', '2021-01-02T12:00:00.000Z', '2021-01-03T12:00:00.000Z'])
  })
})
