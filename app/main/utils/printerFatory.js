"use strict";
exports.__esModule = true;
var fs = require('fs');
var path = require('path');
var http = require('http');
var execFile = require('child_process').execFile;
var url = require('url');
var printerPath = require('../config/constant').PRINTER_PATH;
var tmp = require('../config/path').tmp;
exports.printerFatory = function (targetDir) {
    var tmpDir = targetDir === void 0 ? tmp : path.resolve(targetDir);
    return function (fileUrl) {
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }
        var dateTime = new Date().toLocaleDateString().replace(/[\/\s:]/g, function (s) { return '_'; });
        var dateTimeDir = path.resolve(tmpDir, dateTime);
        if (!fs.existsSync(dateTimeDir)) {
            fs.mkdirSync(dateTimeDir);
        }
        var tmpName = url.parse(fileUrl).pathname.slice(1).split('/').join('_');
        var tmpPath = path.resolve(dateTimeDir, "" + tmpName + (tmpName.endsWith('.pdf') ? '' : '.pdf'));
        var writeStream = fs.createWriteStream(tmpPath).on('close', function () {
            var task = execFile(printerPath, [tmpPath]);
            task.stdout.on('data', function (data) {
                console.log("stdout: " + data);
            });
            task.on('close', function (code) {
                console.log("write clonse: " + code);
            });
            task.on('error', function (err) {
                console.log("write error: " + err);
            });
        });
        console.log('file', fileUrl, '\n');
        http.get(fileUrl, function (res) {
            if (res) {
                res.pipe(writeStream);
                res.on('end', function () {
                    writeStream.end();
                });
            }
        });
    };
};
