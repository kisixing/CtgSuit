const fs = require('fs')
const configPath = require('../config/path')

const log = (str = '') => {
    fs.appendFile(configPath.log, `${new Date().toLocaleString()}\r\n${str}\r\n\r\n`, () => { })
}

const logErr = (str = '') => {
    fs.appendFile(configPath.errLog, `${new Date().toLocaleString()}\r\n${str}\r\n\r\n`, () => { })
}


exports.log = log
exports.logErr = logErr