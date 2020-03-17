import { BrowserWindow } from 'electron';
import { getMainWindow } from "../index";
import { collecWebContentsId } from '../utils/globalMount';
export default (event, { title, url, name }) => {
    const mainWindow = getMainWindow();
    let newWindow = new BrowserWindow({
        title,
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

    newWindow.loadURL(url); // new.html是新开窗口的渲染进程
    collecWebContentsId(name, newWindow)

    // newWindow.on('closed', () => {
    //     newWindow = null;
    // });
}





