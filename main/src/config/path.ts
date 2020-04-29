
import { resolve } from "path";
const { isDev } = require('../utils/is')
// const devBase = resolve('.')
const source = resolve(__dirname, `${isDev ? '../../../main' : '../..'}`)
const assetsPath = resolve(__dirname, '../../asserts')

const resources = resolve('resources')
const execPath = resolve('ctg-suit.exe')
const tmp = resolve('.tmp')
const basePath = resolve(isDev ? '' : resources, 'app', 'main')
const profile = resolve(process.env.USERPROFILE || '/')
const desktop = resolve(process.env.USERPROFILE || '/', 'Desktop')
const appPath = resolve(resources, 'app.asar')
const oldConfig = resolve(profile, 'setting.json')
const defaultConfig = resolve(assetsPath, './defaultSetting.json')
const config = resolve(tmp, 'setting.json')
const errLogPath = resolve(tmp, 'errLog.txt')
const logPath = resolve(tmp, 'log.txt')
const pkg = resolve(source, 'package.json')
const unpackPath = isDev ? tmp : resources
const runtimeJsPath = resolve(basePath, 'runtime/index.js')
const publicPath = resolve(resources, 'app')
export {
    profile,
    desktop,
    source,
    tmp,
    resources,
    config,
    defaultConfig,
    logPath,
    errLogPath,
    pkg,
    appPath,
    execPath,
    unpackPath,
    basePath,
    runtimeJsPath,
    publicPath,
    oldConfig
}