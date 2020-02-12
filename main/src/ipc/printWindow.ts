import { printerFatory } from "../utils/printerFatory";
const printPdf = printerFatory('.tmp/')

export default (event, file) => {
    printPdf(file)
}





