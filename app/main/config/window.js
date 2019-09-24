const path = require('path')
const is = require('electron-is')
const { BrowserWindow } = require('electron')

let count = 0;

function create() {
  count += 1;
  let win = new BrowserWindow({
    width: 1200,
    height: 800,
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
  // and load the index.html of the app.
  win.loadURL(getPath())

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('close', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    count -= 1;
    win = null;
  });
  return win;
}

function getCount() {
  return count;
}

function getPath(){
  let filePath = `file://${path.join(__dirname,'..', '..','render/index.html')}`;
  if(is.dev()){
    filePath = 'http://127.0.0.1:1702/'
  }
  return filePath;
}

module.exports = {
  create,
  getCount
};
