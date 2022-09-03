const { errorManager } = require('../../../src/utils')

describe('errorManager', () => {
  it('should return an object with the error message specified in the parameter', () => {
    const error = {
      message: 'Error test',
      statusCode: 500
    }

    const errorResponse = errorManager({ error, genericMessage: 'Generic message' })

    expect(errorResponse).toMatchObject({
      error: {
        message: 'Error test'
      }
    })
  })

  it('should return an object with the error message object specified in the parameter', () => {
    const error = {
      message: {
        description: 'Error test',
        data: 'Data example'
      },
      statusCode: 500
    }

    const errorResponse = errorManager({ error, genericMessage: 'Generic message' })

    expect(errorResponse).toMatchObject({
      error: {
        message: {
          description: 'Error test',
          data: 'Data example'
        }
      }
    })
  })

  it('should return generic message if error does not have statusCode property', () => {
    const error = {
      message: {
        description: 'Unexpected error'
      }
    }

    const errorResponse = errorManager({ error, genericMessage: 'Generic message' })

    expect(errorResponse).toMatchObject({
      error: {
        message: 'Generic message'
      }
    })
  })
})
