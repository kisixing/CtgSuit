import { configure, getLogger } from 'log4js';
import { logPath, errLogPath, tmp } from "../config/path";
import { appendFile, writeFile } from "fs";
import { resolve } from "path";
export const log = (str = '') => {
    appendFile(logPath, `${new Date().toLocaleString()}\r\n${str}\r\n\r\n`, () => { })
}
export const logErr = (str = '') => {
    appendFile(errLogPath, `${new Date().toLocaleString()}\r\n${str}\r\n\r\n`, () => { })
}

configure({
    appenders: {
        console: {
            filename: resolve(tmp, 'logs/console/_.log'),
            type: 'dateFile',
            alwaysIncludePattern: true,
            keepFileExt: true,
            daysToKeep: 7,
        },
        app: {
            filename: resolve(tmp, 'logs/app/_.log'),
            type: 'dateFile',
            alwaysIncludePattern: true,
            keepFileExt: true,
            daysToKeep: 7,
        },
        error: {
            filename: resolve(tmp, 'logs/error/_.log'),
            type: 'dateFile',
            alwaysIncludePattern: true,
            keepFileExt: true,
            daysToKeep: 7,
        },
    },
    categories: {
        default: { appenders: ['console'], level: 'debug' },
        console: { appenders: ['console'], level: 'debug' },
        error: { appenders: ['error'], level: 'debug' },
        app: { appenders: ['app'], level: 'debug' },

    }
})
const consoleLogger = getLogger('console')
const errorLogger = getLogger('error')
global.console.log = consoleLogger.info.bind(consoleLogger)
global.console.warn = consoleLogger.warn.bind(consoleLogger)
global.console.error = errorLogger.warn.bind(errorLogger)

export const appLogger = getLogger('app')