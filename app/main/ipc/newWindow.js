const printerFatory = require('../utils/printerFatory')
const printPdf = printerFatory('.tmp/')

module.exports = ['printWindow', (event, file) => {
    printPdf(file)
}]





