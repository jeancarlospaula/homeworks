const { checkValidStatusIds } = require('../../src/utils/checkValidStatusIds')

describe('checkValidStatusIds', () => {
  it('should return an error when an invalid status id is provided', () => {
    const statusArray = ['1', '2', '3', '4']
    expect(() => checkValidStatusIds({ statusArray })).toThrowError()
  })

  it('should not return an error when a valid status id is provided', () => {
    const statusArray = ['1', '2', '0']
    expect(() => checkValidStatusIds({ statusArray })).not.toThrowError()
  })
})
