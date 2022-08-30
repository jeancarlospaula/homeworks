const moment = require('moment')
const { tasksStatusList } = require('../../utils/enums/tasksStatusList')
const { getDateFormattedByLanguage } = require('../../utils/getDateFormattedByLanguage')
const { sortDatesArray } = require('../../utils/sortDatesArray')

const getFooterMessage = ({ filters, language = 'en' }) => {
  const filtersMessage = {
    pt: 'Filtros utilizados',
    en: 'Filters used',
    es: 'Filtros utilizados'
  }

  let footerMessage = filtersMessage[language]

  if (filters.subject?.length) {
    const subjectsMessage = {
      pt: 'Matérias: ',
      en: 'Subjects: ',
      es: 'Materias: '
    }

    footerMessage += ` | ${subjectsMessage[language]}${filters.subject.join(', ')}`
  }

  if (filters.status) {
    const statusMessage = {
      pt: 'Situação: ',
      en: 'Status: ',
      es: 'Estado: '
    }

    const statusList = filters.status.split(',')
    const statusNames = []
    statusList.forEach(status => {
      const statusName = tasksStatusList.language[language][status]
      if (statusName) statusNames.push(statusName)
    })

    footerMessage += ` | ${statusMessage[language]}${statusNames.join(', ')}`
  }

  if (filters.finalDate) {
    const finalDateMessage = {
      pt: 'Data Final: ',
      en: 'Final Date: ',
      es: 'Fecha Final: '
    }

    const sortedDates = sortDatesArray(filters.finalDate.split(','))

    const lowestFinalDate = moment(sortedDates[0]).startOf('day').toISOString()
    const highestFinalDate = moment(sortedDates[sortedDates.length - 1]).endOf('day').toISOString()

    footerMessage += ` | ${finalDateMessage[language]}${getDateFormattedByLanguage({ date: lowestFinalDate, language })} - ${getDateFormattedByLanguage({ date: highestFinalDate, language })}`
  }

  if (!filters.subjects?.length && !filters.status && !filters.finalDate) {
    const noFiltersMessage = {
      pt: 'Nenhum filtro utilizado',
      en: 'No filters used',
      es: 'Ningún filtro utilizado'
    }

    footerMessage = noFiltersMessage[language]
  }

  return footerMessage
}

module.exports = { getFooterMessage }
