const checkBodySchema = require('./../../../src/utils/bodySchema/checkBodySchema')
const registerBody = require('./../../../__mocks__/bodyRequests/register.json')
const { registerSchema } = require('./../../../src/utils/bodySchema/bodySchemas.js')

describe('checkBodySchema', () => {
  it('should return an array with the missing fields in the schema', () => {
    const body = Object.assign({}, registerBody)
    delete body.email
    delete body.password

    const fields = checkBodySchema({
      body,
      schema: registerSchema
    })

    expect(fields).toEqual(['email', 'password'])
  })

  it('should return an empty array if all fields are filled', () => {
    const fields = checkBodySchema({
      body: registerBody,
      schema: registerSchema
    })

    expect(fields).toEqual([])
    expect(fields.length).toBeFalsy()
  })
})
