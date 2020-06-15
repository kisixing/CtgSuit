import { logPath, errLogPath } from "../config/path";
import { appendFile,writeFile } from "fs";

export const log = (str = '') => {
    appendFile(logPath, `${new Date().toLocaleString()}\r\n${str}\r\n\r\n`, () => { })
}
export const logErr = (str = '') => {
    appendFile(errLogPath, `${new Date().toLocaleString()}\r\n${str}\r\n\r\n`, () => { })
}

