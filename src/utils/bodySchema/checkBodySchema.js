const checkBodySchema = ({ body, schema }) => {
  const undefiendFields = []

  schema.forEach(prop => {
    if (!body[prop]) return undefiendFields.push(prop)
  })

  return undefiendFields
}

module.exports = checkBodySchema
