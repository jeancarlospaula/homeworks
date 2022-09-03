const errorThrower = require('../errors/errorThrower')

const checkValidLanguages = ({ language }) => {
  const validLanguages = ['pt', 'en', 'es']

  const isValidLanguage = validLanguages.includes(language)

  if (!isValidLanguage) {
    errorThrower({
      message: {
        description: 'Invalid language provided',
        data: {
          language
        }
      },
      statusCode: 400
    })
  }
}

module.exports = { checkValidLanguages }
