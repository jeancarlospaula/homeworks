const templates = require('../../src/templates')

describe('tasksReportEmail', () => {
  it('should return the correct HTML template', () => {
    const template = templates.html.tasksReportEmail({ name: 'John' })
    expect(template).toEqual(`<div>
      <p>Hi John, here is your <b>PDF task report</b> attached.</p>
      <br/>
      <img src='${templates.images.emailBanner}' alt='HomeWorks Logo' height='50'/>
      <br/>
      <br/>
      <p>This is an automated email, please do not reply.</p>
    </div>`)
  })

  it('should return the correct text template', () => {
    const template = templates.text.tasksReportEmail({ name: 'John' })
    expect(template).toEqual('Hi John here is your <b>PDF task report</b> attached.\nThis is an automated email, please do not reply.')
  })
})
