"use strict";
exports.__esModule = true;
var path = require('path');
var profile = require('./path').profile;
var assetsPath = path.resolve(__dirname, '../../asserts');
exports.SETTING_PATH = path.resolve(profile, 'setting.json');
exports.DEFAULT_SETTING_PATH = path.resolve(assetsPath, 'defaultSetting.json');
exports.PRINTER_PATH = path.resolve(assetsPath, 'PDFtoPrinterSelect.exe');
