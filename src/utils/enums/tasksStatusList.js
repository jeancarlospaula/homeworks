const tasksStatusList = {
  enum: {
    'IN PROGRESS': 0,
    LATE: 1,
    FINISHED: 2
  },
  language: {
    pt: {
      0: 'Em andamento',
      1: 'Atrasado',
      2: 'Concluído'
    },
    en: {
      0: 'In progress',
      1: 'Late',
      2: 'Finished'
    },
    es: {
      0: 'A tiempo',
      1: 'Atrasado',
      2: 'Completado'
    }
  },
  translation: {
    finished: {
      pt: 'CONCLUÍDO',
      en: 'FINISHED',
      es: 'COMPLETADO'
    },
    late: {
      pt: 'ATRASADO',
      en: 'LATE',
      es: 'ATRASADO'
    },
    inProgress: {
      pt: 'EM ANDAMENTO',
      en: 'IN PROGRESS',
      es: 'A TIEMPO'
    }
  }
}

module.exports = { tasksStatusList }
