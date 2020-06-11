import { existsSync, mkdir, writeFile,writeFileSync } from 'fs'
import { logErr } from './utils/log'
import { tmp, config, defaultConfig, oldConfig } from './config/path'
let dc

existsSync(tmp) || mkdir(tmp, e => { })
if (existsSync(config)) {
    const c: { [x: string]: any } = require(config)
    if (!c.hasOwnProperty('analysable')) {
        c.analysable = true
    }
    writeFileSync(config, JSON.stringify(c, null, 2))

} else {
    try {
        dc = require(oldConfig)
    } catch (error) {
        dc = require(defaultConfig)
    }
    writeFileSync(config, JSON.stringify(dc, null, 2))
}


process.on('uncaughtException', function (err) {
    logErr(err.stack)
});