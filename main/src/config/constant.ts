const path = require('path');
const { profile } = require('./path')
const assetsPath = path.resolve(__dirname, '../../asserts')
export const SETTING_PATH = path.resolve(profile, 'setting.json')
export const DEFAULT_SETTING_PATH = path.resolve(assetsPath, 'defaultSetting.json')
export const PRINTER_PATH = path.resolve(assetsPath, 'PDFtoPrinterSelect.exe')