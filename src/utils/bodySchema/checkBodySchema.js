const checkBodySchema = ({ body, schema }) => {
  const undefinedFields = []

  schema.forEach(prop => {
    if (!body[prop]) return undefinedFields.push(prop)
  })

  return undefinedFields
}

module.exports = { checkBodySchema }
