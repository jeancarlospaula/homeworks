const moment = require('moment')

const checkTokenExpired = ({ tokenDate, durationToken }) => {
  const currentDate = new Date()
  const validTokenDate = new Date(moment(tokenDate).add({ hours: durationToken }).toISOString())
  const isTokenExpired = currentDate > validTokenDate
  return isTokenExpired
}

module.exports = { checkTokenExpired }
