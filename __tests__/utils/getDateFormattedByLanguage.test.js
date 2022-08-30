const { getDateFormattedByLanguage } = require('../../src/utils/getDateFormattedByLanguage')

describe('getFinalDateFormatted', () => {
  it('should return the correct date', () => {
    const date = '2021-01-30T12:00:00.000Z'

    const finalDateFormattedPortuguese = getDateFormattedByLanguage({ date, language: 'pt' })
    const finalDateFormattedSpanish = getDateFormattedByLanguage({ date, language: 'es' })
    const finalDateFormattedEnglish = getDateFormattedByLanguage({ date, language: 'en' })
    const finalDateFormattedDefault = getDateFormattedByLanguage({ date })

    expect(finalDateFormattedPortuguese).toBe('30/01/2021')
    expect(finalDateFormattedSpanish).toBe('30/01/2021')
    expect(finalDateFormattedEnglish).toBe('01/30/2021')
    expect(finalDateFormattedDefault).toBe('01/30/2021')
  })
})
