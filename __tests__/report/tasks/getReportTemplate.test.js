const {
  getReportTitle,
  getColumnsName,
  getStatusLanguage,
  getReportTemplate
} = require('../../../src/report/tasks/getReportTemplate')
const docDefinitionMock = require('../../../__mocks__/report/tasks/docDefinition')
const moment = require('moment')

describe('getReportTemplate', () => {
  describe('getReportTitle', () => {
    it('should return the title in the correct language', () => {
      const englishTitle = getReportTitle({ language: 'en' })
      const spanishTitle = getReportTitle({ language: 'es' })
      const portugueseTitle = getReportTitle({ language: 'pt' })
      const defaultTitle = getReportTitle({})

      expect(englishTitle).toBe('TASKS REPORT')
      expect(spanishTitle).toBe('REPORTE DE TAREAS')
      expect(portugueseTitle).toBe('RELATÓRIO DE TAREFAS')
      expect(defaultTitle).toBe('TASKS REPORT')
    })
  })

  describe('getColumnName', () => {
    it('should return the column names in the correct language', () => {
      const englishColumns = getColumnsName({ language: 'en' })
      const spanishColumns = getColumnsName({ language: 'es' })
      const portugueseColumns = getColumnsName({ language: 'pt' })
      const defaultColumns = getColumnsName({})

      expect(englishColumns).toEqual(['Name', 'Subject', 'Status', 'Final Date'])
      expect(spanishColumns).toEqual(['Nombre', 'Materia', 'Estado', 'Fecha Final'])
      expect(portugueseColumns).toEqual(['Nome', 'Matéria', 'Situação', 'Data Final'])
      expect(defaultColumns).toEqual(['Name', 'Subject', 'Status', 'Final Date'])
    })
  })

  describe('getStatusLanguage', () => {
    it('should return the correct status when the task is finished', () => {
      const task = {
        finished: true,
        finalDate: moment().subtract({ days: 1 }).toDate()
      }

      const englishStatus = getStatusLanguage({ task, language: 'en' })
      const spanishStatus = getStatusLanguage({ task, language: 'es' })
      const portugueseStatus = getStatusLanguage({ task, language: 'pt' })
      const defaultStatus = getStatusLanguage({ task })

      expect(englishStatus).toBe('FINISHED')
      expect(spanishStatus).toBe('COMPLETADO')
      expect(portugueseStatus).toBe('CONCLUÍDO')
      expect(defaultStatus).toBe('FINISHED')
    })

    it('should return the correct status when the task is late', () => {
      const task = {
        finished: false,
        finalDate: moment().subtract({ days: 1 })
      }

      const englishStatus = getStatusLanguage({ task, language: 'en' })
      const spanishStatus = getStatusLanguage({ task, language: 'es' })
      const portugueseStatus = getStatusLanguage({ task, language: 'pt' })
      const defaultStatus = getStatusLanguage({ task })

      expect(englishStatus).toBe('LATE')
      expect(spanishStatus).toBe('ATRASADO')
      expect(portugueseStatus).toBe('ATRASADO')
      expect(defaultStatus).toBe('LATE')
    })

    it('should return the correct status when the task is in progress', () => {
      const task = {
        finished: false,
        finalDate: moment().add({ days: 1 })
      }

      const englishStatus = getStatusLanguage({ task, language: 'en' })
      const spanishStatus = getStatusLanguage({ task, language: 'es' })
      const portugueseStatus = getStatusLanguage({ task, language: 'pt' })
      const defaultStatus = getStatusLanguage({ task })

      expect(englishStatus).toBe('IN PROGRESS')
      expect(spanishStatus).toBe('A TIEMPO')
      expect(portugueseStatus).toBe('EM ANDAMENTO')
      expect(defaultStatus).toBe('IN PROGRESS')
    })
  })

  it('should return the correct docDefinition', () => {
    const tasks = [
      {
        name: 'Task 1',
        subject: {
          name: 'Subject 1'
        },
        finalDate: moment('2022-08-31')
      },
      {
        name: 'Task 2',
        subject: {
          name: 'Subject 2'
        },
        finalDate: moment('2022-08-31')
      },
      {
        name: 'Task 3',
        subject: {
          name: 'Subject 3'
        },
        finalDate: moment('2022-08-31')
      }
    ]

    const filters = {
      status: '0, 1, 2',
      subject: ['Subject 1', 'Subject 2', 'Subject 3'],
      language: 'pt',
      finalDate: moment('2022-08-31').toISOString()
    }

    const docDefinition = getReportTemplate({ tasks, filters })

    expect(docDefinition).toEqual(docDefinitionMock)
  })
})
