"use strict";
exports.__esModule = true;
var _a = require('electron'), ipcMain = _a.ipcMain, dialog = _a.dialog;
var _b = require('fs'), createWriteStream = _b.createWriteStream, mkdirSync = _b.mkdirSync, existsSync = _b.existsSync;
var request = require('http').request;
var resolve = require('path').resolve;
var parse = require('url').parse;
var exec = require('child_process').exec;
exports["default"] = (function () {
    ipcMain.on('\u0064\u006f\u0077\u006e\u006c\u006f\u0061\u0064\u0041\u0070\u0070', appDownload);
});
function appDownload(e, url) {
    if (url === void 0) { url = ''; }
    var pathname = parse(url).pathname;
    var filename = pathname.slice(pathname.lastIndexOf('/') + 1);
    var insDir = resolve(process.env.USERPROFILE, 'Desktop');
    var filePath = resolve(insDir, filename);
    existsSync(insDir) || mkdirSync(insDir);
    var writeStream = createWriteStream(filePath)
        .on('close', function () {
        e.sender.send('\u0061\u0070\u0070\u0044\u006f\u0077\u006e\u006c\u006f\u0061\u0064\u0065\u0064');
        dialog.showMessageBox({
            message: '下载完成，是否进行安装？',
            buttons: ['cancel', 'ok']
        }, function (_) { return exec("explorer " + (_ ? filePath : insDir)); });
    });
    request(url, function (incomingMessage) { return incomingMessage.pipe(writeStream); }).end();
}
