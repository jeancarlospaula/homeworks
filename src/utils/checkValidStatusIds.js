const { tasksStatusList } = require('./enums/tasksStatusList')
const errorThrower = require('./errors/errorThrower')

const checkValidStatusIds = ({ statusArray }) => {
  const idsStatus = [
    tasksStatusList.enum['IN PROGRESS'].toString(),
    tasksStatusList.enum.LATE.toString(),
    tasksStatusList.enum.FINISHED.toString()
  ]

  const differentIds = statusArray.filter(id => !idsStatus.includes(id))

  if (differentIds.length) {
    errorThrower({
      message: {
        description: 'Invalid status id provided',
        data: differentIds
      },
      statusCode: 400
    })
  }
}

module.exports = { checkValidStatusIds }
