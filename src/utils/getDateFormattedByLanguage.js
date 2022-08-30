const moment = require('moment')

const getDateFormattedByLanguage = ({ date, language = 'en' }) => {
  const finalDateFormatted = {
    pt: 'DD/MM/YYYY',
    en: 'MM/DD/YYYY',
    es: 'DD/MM/YYYY'
  }

  return moment(date).format(finalDateFormatted[language])
}

module.exports = { getDateFormattedByLanguage }
