"use strict";
exports.__esModule = true;
var _a = require('../config/path'), configPath = _a.config, pkgPath = _a.pkg;
var fs = require('fs');
var v = require(pkgPath).version;
fs.readFile(configPath, 'utf-8', function (err, data) {
    if (!err) {
        var config_1 = JSON.parse(data);
        config_1.version = v;
        fs.writeFile(configPath, JSON.stringify(configPath, null, 2), function (e) {
            throw e;
        });
    }
    else {
        throw err;
    }
});
