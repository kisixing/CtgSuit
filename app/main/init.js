var _a = require('fs'), existsSync = _a.existsSync, mkdir = _a.mkdir, writeFile = _a.writeFile;
var logErr = require('./utils/log').logErr;
var _b = require('./config/path'), tmp = _b.tmp, config = _b.config, defaultConfig = _b.defaultConfig;
var dc = require(defaultConfig);
existsSync(config) || writeFile(config, JSON.stringify(dc), function (e) { });
existsSync(tmp) || mkdir(tmp, function (e) { });
process.on('uncaughtException', function (err) {
    logErr(err.stack);
});
