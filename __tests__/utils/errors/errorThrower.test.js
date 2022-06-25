const errorThrower = require('../../../src/utils/errors/errorThrower')

describe('errorThrower', () => {
  it('should throw an error', () => {
    expect(() => {
      errorThrower({
        message: 'Error test'
      })
    }).toThrow()
  })

  it('should throw an error with status code', () => {
    try {
      errorThrower({
        message: 'Error test',
        statusCode: 300
      })
    } catch (error) {
      expect(error).toHaveProperty('statusCode')
      expect(error.statusCode).toEqual(300)
      expect(error.statusCode).toBeTruthy()
    }
  })

  it('should throw an error without status code', () => {
    try {
      errorThrower({
        message: 'Error test'
      })
    } catch (error) {
      expect(error.statusCode).toBeFalsy()
    }
  })

  it('should throw an error with properties on message object converted to string', () => {
    try {
      errorThrower({
        message: {
          description: 'Error test',
          data: 'Example data'
        }
      })
    } catch (error) {
      expect(error.message).toEqual('{"description":"Error test","data":"Example data"}')
      expect(error.message).not.toEqual({
        message: {
          description: 'Error test',
          data: 'Example data'
        }
      })
    }
  })
})
