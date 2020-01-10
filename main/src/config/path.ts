
const { isDev } = require('../utils/is')
const { resolve } = require('path')
const devBase = resolve('.')
const source = resolve(__dirname, '../../')

const base = isDev ? devBase : source
const profile = resolve(process.env.USERPROFILE)
const desktop = resolve(process.env.USERPROFILE, 'Desktop')
const tmp = resolve('.tmp')
const resources = resolve('resources')

const config = resolve(profile, 'setting.json')
const defaultConfig = resolve(__dirname, './defaultSetting.json')
const errLog = resolve(tmp, 'errLog.txt')
const log = resolve(tmp, 'log.txt')
const pkg = resolve(source, 'package.json')

export {
    profile,
    desktop,
    source,
    tmp,
    resources,
}