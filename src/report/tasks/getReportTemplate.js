const { getFooterMessage } = require('./getFooterMessage')
const {
  getDateFormattedByLanguage,
  tasksStatusLanguages: {
    translation: statusTranslation
  }
} = require('../../utils')

const getReportTitle = ({ language = 'en' }) => {
  const title = {
    en: 'TASKS REPORT',
    es: 'REPORTE DE TAREAS',
    pt: 'RELATÓRIO DE TAREFAS'
  }

  return title[language]
}

const getColumnsName = ({ language = 'en' }) => {
  const languages = {
    pt: ['Nome', 'Matéria', 'Situação', 'Data Final'],
    en: ['Name', 'Subject', 'Status', 'Final Date'],
    es: ['Nombre', 'Materia', 'Estado', 'Fecha Final']
  }

  return languages[language]
}

const getStatusLanguage = ({ task, language = 'en' }) => {
  return task.finished
    ? statusTranslation.finished[language]
    : Date.now() > task.finalDate
      ? statusTranslation.late[language]
      : statusTranslation.inProgress[language]
}

const getReportTemplate = ({ tasks, filters }) => {
  const filtersUsed = {
    status: filters.status,
    subject: filters.subject,
    finalDate: filters.finalDate,
    language: filters.language
  }

  const columnsName = getColumnsName({ language: filtersUsed.language })
  const footerMessage = getFooterMessage({ filters: filtersUsed, language: filters.language })

  const docDefinition = {
    defaultStyle: {
      font: 'Helvetica'
    },
    content: [
      {
        text: getReportTitle({ language: filtersUsed.language }),
        style: 'header'
      },
      {
        style: 'table',
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*'],
          body: [
            [
              ...columnsName.map(columnName => {
                return {
                  text: columnName,
                  style: 'tableHeader'
                }
              })
            ],
            ...tasks.map(task => [
              {
                text: task.name,
                style: 'taskName'
              },
              {
                text: task.subject.name,
                style: 'rowText'
              },
              {
                text: getStatusLanguage({ task, language: filtersUsed.language }),
                style: task.finished ? 'finishedTask' : Date.now() > task.finalDate ? 'lateTask' : 'onTimeTask'
              },
              {
                text: getDateFormattedByLanguage({ date: task.finalDate, language: filtersUsed.language }),
                style: 'rowText'
              }
            ])
          ]
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      },
      table: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black',
        alignment: 'center',
        fillColor: '#6557f5'
      },
      taskName: {
        margin: [0, 5, 0, 5]
      },
      finishedTask: {
        color: 'green',
        alignment: 'center',
        margin: [0, 5, 0, 5]
      },
      lateTask: {
        color: 'red',
        alignment: 'center',
        margin: [0, 5, 0, 5]
      },
      onTimeTask: {
        color: '#6557f5',
        alignment: 'center',
        margin: [0, 5, 0, 5]
      },
      rowText: {
        alignment: 'center',
        margin: [0, 5, 0, 5]
      }
    },
    footer: {
      columns: [
        {
          text: footerMessage,
          alignment: 'center',
          margin: [0, 0, 0, 10],
          color: '#808080',
          fontSize: 8
        }
      ]
    }
  }

  return docDefinition
}

module.exports = {
  getReportTitle,
  getColumnsName,
  getStatusLanguage,
  getReportTemplate
}
