const { checkValidLanguages } = require('../../src/utils')

describe('checkValidLanguages', () => {
  it('should throw an error when the language is not valid', () => {
    const language = 'invalid'

    expect(() => checkValidLanguages({ language })).toThrow()
  })

  it('should not throw an error when the language is valid', () => {
    const portuguese = 'pt'
    const english = 'en'
    const spanish = 'es'

    expect(() => checkValidLanguages({ language: portuguese })).not.toThrow()
    expect(() => checkValidLanguages({ language: english })).not.toThrow()
    expect(() => checkValidLanguages({ language: spanish })).not.toThrow()
  })
})
