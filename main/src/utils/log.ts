import { logPath, errLogPath } from "../config/path";
const fs = require('fs')

export const log = (str = '') => {
    fs.appendFile(logPath, `${new Date().toLocaleString()}\r\n${str}\r\n\r\n`, () => { })
}
export const logErr = (str = '') => {
    fs.appendFile(errLogPath, `${new Date().toLocaleString()}\r\n${str}\r\n\r\n`, () => { })
}

