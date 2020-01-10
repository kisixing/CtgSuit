"use strict";
exports.__esModule = true;
var path = require('path');
var is = require('electron-is');
function getMainPath() {
    var filePath = "" + path.join(__dirname, '..', '..', 'render/index.html');
    if (is.dev()) {
        console.log('----------开发环境----------');
        filePath = 'http://127.0.0.1:1702/';
    }
    return filePath;
}
exports.getMainPath = getMainPath;
function getNewPath(params) {
    var filePath = "file://" + path.join(__dirname, '..', '..', 'render/handbook/index.html');
    if (is.dev()) {
        filePath = 'http://127.0.0.1:1702/handbook/index.html';
    }
    return filePath;
}
exports.getNewPath = getNewPath;
function getPDFviewPath(params) {
    var filePath = "file://" + path.join(__dirname, '..', '..', 'render/pdfjs/web/viewer.html');
    if (is.dev()) {
        filePath = 'http://127.0.0.1:1702/pdfjs/web/viewer.html';
    }
    return filePath;
}
exports.getPDFviewPath = getPDFviewPath;
