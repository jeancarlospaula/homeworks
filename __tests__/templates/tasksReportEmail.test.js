const { images } = require('../../src/templates/images/images.js')
const { htmlTasksReportEmail, textTasksReportEmail } = require('../../src/templates/tasksReportEmail')

describe('tasksReportEmail', () => {
  it('should return the correct HTML template', () => {
    const template = htmlTasksReportEmail({ name: 'John' })
    expect(template).toEqual(`<div>
      <p>Hi John, here is your <b>PDF task report</b> attached.</p>
      <br/>
      <img src='${images.emailBanner}' alt='HomeWorks Logo' height='50'/>
      <br/>
      <br/>
      <p>This is an automated email, please do not reply.</p>
    </div>`)
  })

  it('should return the correct text template', () => {
    const template = textTasksReportEmail({ name: 'John' })
    expect(template).toEqual('Hi John here is your <b>PDF task report</b> attached.\nThis is an automated email, please do not reply.')
  })
})
