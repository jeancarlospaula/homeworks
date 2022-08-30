const PdfPrinter = require('pdfmake')
const { emailSender } = require('../email/emailSender')

const pdfGenerator = async ({ fonts, docDefinition, params }) => {
  const printer = new PdfPrinter(fonts)

  const pdfDoc = printer.createPdfKitDocument(docDefinition)

  const chunks = []

  pdfDoc.on('data', chunk => chunks.push(chunk))
  pdfDoc.end()
  pdfDoc.on('end', async () => {
    const pdfFile = Buffer.concat(chunks)

    const emailParams = {
      ...params,
      attachments: [
        {
          ...params.attachments[0],
          content: pdfFile
        }
      ]
    }

    await emailSender(emailParams)
  })
}

module.exports = { pdfGenerator }
