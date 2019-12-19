const path = require('path');
const { profile } = require('./path')
module.exports = {
    SETTING_PATH: path.resolve(profile, 'setting.json'),
    DEFAULT_SETTING_PATH: path.resolve(__dirname, 'defaultSetting.json'),
    PRINTER_PATH: path.resolve(__dirname, '../libs/PDFtoPrinterSelect.exe')
}