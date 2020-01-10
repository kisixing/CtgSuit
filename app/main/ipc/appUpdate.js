"use strict";
exports.__esModule = true;
var _a = require('electron'), dialog = _a.dialog, app = _a.app;
var is = require('electron-is');
var _b = require('fs'), createWriteStream = _b.createWriteStream, mkdirSync = _b.mkdirSync, existsSync = _b.existsSync, readFileSync = _b.readFileSync, unlink = _b.unlink;
var request = require('http').request;
var resolve = require('path').resolve;
var _c = require('../utils/log'), log = _c.log, logErr = _c.logErr;
var _d = require('../config/path'), resources = _d.resources, configPath = _d.config, pkg = _d.pkg, tmp = _d.tmp;
var isDev = require('../utils/is').isDev;
delete require.cache[pkg];
var version = require(pkg).version;
var config = JSON.parse(readFileSync(configPath, 'utf-8'));
var xhr_url = config.xhr_url;
if (!(xhr_url && version))
    throw 'eee';
var compress = require('compressing');
var tar = compress.tar, gzip = compress.gzip;
var f = false;
function appUpdate(e) {
    if (f)
        return;
    if (is.dev())
        return;
    f = true;
    log("version-update \u5F00\u59CB");
    request("http://" + xhr_url + "/api/version-compare/ctg-suit/" + version, function (im) {
        im.on('readable', function () {
            var res = im.read();
            log("version-compare:" + version + ":" + res);
            if (res) {
                var _a = JSON.parse(res.toString()), filename = _a.uri, enable_1 = _a.enable, newV_1 = _a.name;
                f = false;
                if (filename && newV_1) {
                    var tgzPath_1 = resolve(tmp, filename);
                    var tarPath_1 = resolve(tmp, filename + ".tar");
                    var writeStream_1 = createWriteStream(tgzPath_1).on('close', function () {
                        enable_1
                            ? run(tgzPath_1, tarPath_1)
                            : dialog.showMessageBox({
                                message: "\u68C0\u6D4B\u5230\u65B0\u7248\u672C" + newV_1 + "\uFF0C\u662F\u5426\u540E\u53F0\u5B89\u88C5",
                                buttons: ['cancel', 'ok']
                            }, function (_) {
                                _ && run(tgzPath_1, tarPath_1);
                            });
                    });
                    request("http://" + xhr_url + "/api/version-uri/" + filename, function (im) {
                        return im.pipe(writeStream_1);
                    }).end();
                }
                else {
                    setTimeout(appUpdate, 1000 * 60 * 60);
                }
            }
        });
    }).end();
}
exports["default"] = ['ready', appUpdate];
function run(tgzPath, tarPath) {
    return gzip.uncompress(tgzPath, tarPath).then(function () {
        unlink(tgzPath, function (e) { return !!e && logErr(e.stack); });
        tar.uncompress(tarPath, isDev ? tmp : resources).then(function () {
            unlink(tarPath, function (e) { return !!e && logErr(e.stack); });
            dialog.showMessageBox({
                message: '应用更新成功，是否立即重启以生效？',
                buttons: ['cancel', 'ok']
            }, function (_) {
                if (_) {
                    // e.sender.send('installed')
                    // getMainWindow().reload()
                    setTimeout(function () {
                        app.relaunch();
                        app.exit();
                    }, 0);
                }
            });
        });
    });
}
