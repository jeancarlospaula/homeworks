const { getFooterMessage } = require('../../../src/report/tasks')

describe('getFooterMessage', () => {
  it('should return the correct message if filters are passed', () => {
    const filters = {
      subject: ['Português', 'Matemática'],
      status: '0,1,2',
      finalDate: '2021-01-01,2021-03-01,2021-02-01'
    }

    const footerMessagePortuguese = getFooterMessage({ filters, language: 'pt' })
    const footerMessageEnglish = getFooterMessage({ filters, language: 'en' })
    const footerMessageSpanish = getFooterMessage({ filters, language: 'es' })

    expect(footerMessagePortuguese).toBe('Filtros utilizados | Matérias: Português, Matemática | Situação: Em andamento, Atrasado, Concluído | Data Final: 01/01/2021 - 01/03/2021')
    expect(footerMessageEnglish).toBe('Filters used | Subjects: Português, Matemática | Status: In progress, Late, Finished | Final Date: 01/01/2021 - 03/01/2021')
    expect(footerMessageSpanish).toBe('Filtros utilizados | Materias: Português, Matemática | Estado: A tiempo, Atrasado, Completado | Fecha Final: 01/01/2021 - 01/03/2021')
  })

  it('should return the correct message if filters are not passed', () => {
    const filters = {
      subject: []
    }

    const footerMessagePortuguese = getFooterMessage({ language: 'pt', filters })
    const footerMessageEnglish = getFooterMessage({ language: 'en', filters })
    const footerMessageSpanish = getFooterMessage({ language: 'es', filters })

    expect(footerMessagePortuguese).toBe('Nenhum filtro utilizado')
    expect(footerMessageEnglish).toBe('No filters used')
    expect(footerMessageSpanish).toBe('Ningún filtro utilizado')
  })
})
