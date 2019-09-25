// Modules to control application life and create native browser window
const { app, ipcMain, globalShortcut, dialog } = require('electron');
const is = require('electron-is');
const window = require('./config/window.js');
const menu = require('./config/menu.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

ipcMain.on('msg', (event, msg) => {
  console.log('主进程收到消息==>', msg);
  event.sender.send('reply', '这是主进程消息');
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  // init menus
  menu.init();
  // Create the browser window.
  window.create();

  // 加载 devtools extension
  if (is.dev()) {
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function(event) {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (window.getCount() === 0) {
    window.create();
  }
});

app.on('quit', function() {});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
