import { ipcRenderer } from 'electron';
import config from './config';
export const printPdf = (url: string) => {
    const filePath = `${config.apiPrefix}${url}`
    ipcRenderer.send('printWindow', filePath)
}


export function getItemCbs(id: string) {
    const cbs = window['ITEM_CBS'] = window['ITEM_CBS'] || {}
    const cb = typeof cbs[id] === 'function' ? cbs[id] : () => { }
    return cb
}
export function setItemCbs(id: string, cb = () => { }) {
    const cbs = window['ITEM_CBS'] = window['ITEM_CBS'] || {}
    cbs[id] = cb
}
