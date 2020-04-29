import { resolve } from 'path'
import { defaultConfig, config } from './path'
const assetsPath = resolve(__dirname, '../../asserts')
export const SETTING_PATH = config
export const DEFAULT_SETTING_PATH = defaultConfig
export const PRINTER_PATH = resolve(assetsPath, 'PDFtoPrinterSelect.exe')