"use strict";
exports.__esModule = true;
var electron = require('electron');
var Menu = electron.Menu;
var app = electron.app;
var hasMenus = true;
var template = [
    {
        label: 'App',
        submenu: [
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
        ]
    },
    {
        label: '编辑',
        submenu: [
            { role: 'undo', label: '撤销', accelerator: 'CmdOrCtrl+Z' },
            { role: 'redo', label: '重做', accelerator: 'Shift+CmdOrCtrl+Z' },
            { type: 'separator' },
            { role: 'cut', label: '剪切', accelerator: 'CmdOrCtrl+X' },
            { role: 'copy', label: '复制', accelerator: 'CmdOrCtrl+C' },
            { role: 'paste', label: '粘贴', accelerator: 'CmdOrCtrl+V' },
            { role: 'selectall', label: '全选', accelerator: 'CmdOrCtrl+A' },
        ]
    },
    {
        label: '查看',
        submenu: [
            { role: 'reload', label: '重载', accelerator: 'CmdOrCtrl+R' },
            {
                role: 'toggledevtools',
                label: '切换开发者工具',
                accelerator: (function () {
                    if (process.platform === 'darwin') {
                        return 'Alt+Command+I';
                    }
                    else {
                        return 'Ctrl+Shift+I';
                    }
                })(),
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                }
            },
            { type: 'separator' },
            {
                role: 'togglefullscreen',
                label: '切换全屏',
                accelerator: (function () {
                    if (process.platform === 'darwin') {
                        return 'Ctrl+Command+F';
                    }
                    else {
                        return 'F11';
                    }
                })(),
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                    }
                }
            },
        ]
    },
    {
        role: 'window',
        label: '窗口',
        submenu: [
            { role: 'minimize', label: '最小化', accelerator: 'CmdOrCtrl+M' },
            { role: 'close', label: '关闭', accelerator: 'CmdOrCtrl+W' },
            {
                label: '重新打开窗口',
                accelerator: 'CmdOrCtrl+Shift+T',
                enabled: false,
                key: 'reopenMenuItem',
                click: function () {
                    app.emit('activate');
                }
            },
            {
                label: '帮助',
                role: 'help',
                submenu: [
                    {
                        label: '学习更多',
                        click: function () {
                            electron.shell.openExternal('http://electron.atom.io');
                        }
                    },
                ]
            },
        ]
    },
];
if (process.platform === 'darwin') {
    var name_1 = electron.app.getName();
    template.unshift({
        label: name_1,
        submenu: [{
                label: "\u5173\u4E8E " + name_1,
                role: 'about'
            }, {
                type: 'separator'
            }, {
                label: '服务',
                role: 'services',
                submenu: []
            }, {
                type: 'separator'
            }, {
                label: "\u9690\u85CF " + name_1,
                accelerator: 'Command+H',
                role: 'hide'
            }, {
                label: '隐藏其它',
                accelerator: 'Command+Alt+H',
                role: 'hideothers'
            }, {
                label: '显示全部',
                role: 'unhide'
            }, {
                type: 'separator'
            }, {
                label: '退出',
                accelerator: 'Command+Q',
                click: function () {
                    app.quit();
                }
            }]
    });
}
exports.menus = hasMenus ? Menu.buildFromTemplate(template) : null;
