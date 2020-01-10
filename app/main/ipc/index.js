"use strict";
exports.__esModule = true;
var fs = require('fs');
var ipcMain = require('electron').ipcMain;
fs.readdir(__dirname, function (e, files) {
    !e && (files.forEach(function (f) {
        if (f === 'index.js')
            return;
        var args = require("./" + f);
        if (Array.isArray(args)) {
            ipcMain.on(args[0], args[1]);
        }
    }));
});
