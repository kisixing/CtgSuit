const { existsSync, mkdir, writeFile } = require('fs')
const { logErr } = require('./utils/log')

const { tmp, config, defaultConfig } = require('./config/path')
const dc = require(defaultConfig)
existsSync(config) || writeFile(config, JSON.stringify(dc), e => { })
existsSync(tmp) || mkdir(tmp, e => { })


process.on('uncaughtException', function (err) {
    logErr(err.stack)
});