import { ipcRenderer } from 'electron';
import config from './config';
export const printPdf = (url: string) => {
    const filePath = `${config.apiPrefix}${url}`
    ipcRenderer.send('printWindow', filePath)
}