import { existsSync, mkdir, writeFile } from 'fs'
import { logErr } from './utils/log'
import { tmp, config, defaultConfig, oldConfig } from './config/path'
let dc
try {
    dc = require(oldConfig)
} catch (error) {
    dc = require(defaultConfig)
}
existsSync(tmp) || mkdir(tmp, e => { })
existsSync(config) || writeFile(config, JSON.stringify(dc, null, 2), e => { })


process.on('uncaughtException', function (err) {
    logErr(err.stack)
});