const path = require('path');

module.exports = {
    SETTING_PATH: '.setting',
    DEFAULT_SETTING_PATH: path.resolve(__dirname, '.defaultSetting'),
    DEFAULT_SETTING_PATH__RUNTIME: path.resolve(__dirname, '../../../src/setting.ts'),
    PRINTER_PATH: path.resolve(__dirname, '../libs/PDFtoPrinterSelect.exe')
}