require('./init')
import { BrowserWindow, ipcMain, Menu, dialog } from 'electron';
const { getMainPath } = require('./config/window');

import { menus } from "./config/menu";
import { singleInstanceLock } from "./utils/singleInstanceLock";
import './ipc'
import { globalMount } from "./utils/globalMount";
globalMount()
let mainWindow;

singleInstanceLock(mainWindow).then(app => {

  ipcMain.on('closeMainWindow', (event) => {
    mainWindow = null;
    app.exit();
  })

  ipcMain.on('openDevTools', (event) => {
    mainWindow.webContents.openDevTools();
  });

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1440,
      height: 900,
      show: false,
      autoHideMenuBar: true,
      fullscreen: false, // 默认全屏
      webPreferences: {
        javascript: true,
        plugins: true,
        nodeIntegration: true, // 是否集成 Nodejs
        webSecurity: false,
      },
      icon: require.resolve('../asserts/icons/64x64.ico'),
    })

    Menu.setApplicationMenu(menus);

    mainWindow.loadURL(getMainPath());

    mainWindow.maximize();
    mainWindow.show();


    mainWindow.on('close', function (e) {
      dialog.showMessageBox(
        {
          type: 'info',
          title: '提示信息',
          message: '确定关闭应用？',
          buttons: ['cancel', 'ok'],
        },
        function (index) {
          e.preventDefault();
          if (index === 0) {
            e.preventDefault();
          } else {
            mainWindow.webContents.executeJavaScript(`
              localStorage.removeItem('Lian-Med-Access-Token');
          `)
            setTimeout(() => {
              mainWindow = null;
              app.exit();
            }, 500);
          }
        },
      );
      e.preventDefault();
    });


  }

  app.on('ready', createWindow);

  app.on('window-all-closed', function () {

    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow();
    };
  });

})

export const getMainWindow = () => {
  return mainWindow
}