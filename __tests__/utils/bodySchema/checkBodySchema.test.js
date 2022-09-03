const { bodySchemas } = require('./../../../src/utils')
const { checkBodySchema } = require('./../../../src/utils')
const registerBody = require('./../../../__mocks__/bodyRequests/register.json')

describe('checkBodySchema', () => {
  it('should return an array with the missing fields in the schema', () => {
    const body = Object.assign({}, registerBody)
    delete body.email
    delete body.password

    const fields = checkBodySchema({
      body,
      schema: bodySchemas.account.register
    })

    expect(fields).toEqual(['email', 'password'])
  })

  it('should return an empty array if all fields are filled', () => {
    const fields = checkBodySchema({
      body: registerBody,
      schema: bodySchemas.account.register
    })

    expect(fields).toEqual([])
    expect(fields.length).toBeFalsy()
  })
})
