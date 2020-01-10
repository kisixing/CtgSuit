const fs = require('fs')
const configPath = require('../config/path')

export const log = (str = '') => {
    fs.appendFile(configPath.log, `${new Date().toLocaleString()}\r\n${str}\r\n\r\n`, () => { })
}

export const logErr = (str = '') => {
    fs.appendFile(configPath.errLog, `${new Date().toLocaleString()}\r\n${str}\r\n\r\n`, () => { })
}

