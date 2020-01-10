"use strict";
exports.__esModule = true;
var fs = require('fs');
var configPath = require('../config/path');
exports.log = function (str) {
    if (str === void 0) { str = ''; }
    fs.appendFile(configPath.log, new Date().toLocaleString() + "\r\n" + str + "\r\n\r\n", function () { });
};
exports.logErr = function (str) {
    if (str === void 0) { str = ''; }
    fs.appendFile(configPath.errLog, new Date().toLocaleString() + "\r\n" + str + "\r\n\r\n", function () { });
};
