
const { isDev } = require('../utils/is')
const { resolve } = require('path')
const devBase = resolve('.')
const source = resolve(__dirname, '../../')

const base = isDev ? devBase : source
const profile = resolve(process.env.USERPROFILE)
const desktop = resolve(process.env.USERPROFILE, 'Desktop')
const tmp = resolve('.tmp')
const resources = resolve('resources')
module.exports = {
    profile,
    desktop,
    source,
    tmp,
    resources,
    config: resolve(profile, 'setting.json'),
    defaultConfig: resolve(__dirname, './defaultSetting.json'),
    errLog: resolve(tmp, 'errLog.txt'),
    log: resolve(tmp, 'log.txt'),
    pkg: resolve(source, 'package.json'),
    
}