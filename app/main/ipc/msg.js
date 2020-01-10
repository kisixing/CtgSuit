"use strict";
exports.__esModule = true;
exports["default"] = ['msg', function (event, msg) {
        console.log('主进程收到消息==>', msg);
        event.sender.send('reply', '这是主进程消息');
    }];
