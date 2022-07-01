const checkTokenExpired = require('../../src/utils/checkTokenExpired')
const moment = require('moment')

describe('checkTokenExpired', () => {
  it('should return true when token expiration date is less than current date', () => {
    const dataCriacaoToken = moment(new Date()).subtract({ hours: 3 })
    const isTokenExpired = checkTokenExpired({
      tokenDate: dataCriacaoToken,
      durationToken: 2
    })
    expect(isTokenExpired).toBeTruthy()
  })

  it('should return false when token expiration date is greater than current date', () => {
    const dataCriacaoToken = moment(new Date()).subtract({ hours: 1 })
    const isTokenExpired = checkTokenExpired({
      tokenDate: dataCriacaoToken,
      durationToken: 2
    })
    expect(isTokenExpired).toBeFalsy()
  })
})
