import { BrowserWindow } from 'electron';
import { getMainWindow } from "../index";
const { getNewPath } = require('../config/window');

export default (event, file) => {
    const mainWindow = getMainWindow();
    console.log('mian', mainWindow)
    console.log('mian22', getNewPath())
    let newWindow = new BrowserWindow({
        title: '操作手册',
        width: 1280,
        height: 720,
        resizable: true, // 窗口大小是否可变
        frame: true, // 是否带边框
        parent: mainWindow, // mainWindow是主窗口 父窗口
        modal: false, // 是否模态窗口
        webPreferences: {
            javascript: true,
            plugins: true,
            nodeIntegration: true, // 是否集成 Nodejs
            webSecurity: false,
        },
    });
    newWindow.loadURL(getNewPath()); // new.html是新开窗口的渲染进程
    // newWindow.on('closed', () => {
    //     newWindow = null;
    // });
}





