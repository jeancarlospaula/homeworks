const sortDatesArray = (datesArray) => {
  const sortedDates = datesArray.sort((a, b) => new Date(a) - new Date(b))

  const sortedValidDates = []
  sortedDates.forEach(date => date && sortedValidDates.push(date))

  return sortedValidDates
}

module.exports = { sortDatesArray }
