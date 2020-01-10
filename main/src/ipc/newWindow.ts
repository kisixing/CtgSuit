import { printerFatory  } from "../utils/printerFatory";
const printPdf = printerFatory('.tmp/')

export default ['printWindow', (event, file) => {
    printPdf(file)
}]





