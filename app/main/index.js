// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const { getMainPath, getNewPath } = require('./config/window');
const menus = require('./config/menu');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let newWindow;

ipcMain.on('msg', (event, msg) => {
  console.log('主进程收到消息==>', msg);
  event.sender.send('reply', '这是主进程消息');
});

ipcMain.on('newWindow', (event) => {
  newWindow = new BrowserWindow({
    title: '操作手册',
    width: 800,
    height: 600,
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
  newWindow.on('closed', () => {
    newWindow = null;
  });
});

ipcMain.on('closeMainWindow', (event) => {
  mainWindow = null;
  app.quit();
})

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false,
    },
    // webPreferences: {
    //   preload: path.join(__dirname, 'preload.js')
    // }
  });

  Menu.setApplicationMenu(menus);

  // and load the index.html of the app.
  mainWindow.loadURL(getMainPath());

  // Open the DevTools.打开开发者工具
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  // mainWindow.on('closed', function() {
  //   // Dereference the window object, usually you would store windows
  //   // in an array if your app supports multi windows, this is the time
  //   // when you should delete the corresponding element.
  //   mainWindow = null;
  // });

  mainWindow.on('close', function(e) {
    // dialog.showMessageBox({
    //   type: 'info',
    //   title: 'Information',
    //   message: '确定要关闭吗？',
    //   buttons: ['最小化','直接退出']
    // }, (index) => {
    //   if(index === 0) {
    //     e.preventDefault();		// 阻止默认行为，一定要有
    //     mainWindow.minimize();	// 调用 最小化实例方法
    //   } else {
    //     mainWindow = null;
    //     // app.quit();	// 不要用quit();试了会弹两次
    //     app.exit();		// exit()直接关闭客户端，不会执行quit();
    //   }
    // })
    dialog.showMessageBox(
      {
        type: 'info',
        title: '提示信息',
        message: '确定关闭应用？',
        buttons: ['cancel', 'ok'],
      },
      function(index) {
        if (index === 0) {
          e.preventDefault();
        } else {
          mainWindow = null;
          app.exit();
        }
      },
    );
    e.preventDefault();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  };
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。
