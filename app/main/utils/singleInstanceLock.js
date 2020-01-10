"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
exports.singleInstanceLock = function (myWindow) { return new Promise(function (res, rej) {
    var gotTheLock = electron_1.app.requestSingleInstanceLock();
    if (!gotTheLock) {
        electron_1.app.quit();
        rej();
    }
    else {
        electron_1.app.on('second-instance', function (event, commandLine, workingDirectory) {
            // Someone tried to run a second instance, we should focus our window.
            if (myWindow) {
                if (myWindow.isMinimized())
                    myWindow.restore();
                myWindow.focus();
            }
        });
        res(electron_1.app);
    }
}); };
