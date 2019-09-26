const path = require('path');
const is = require('electron-is');

function getMainPath() {
  let filePath = `file://${path.join(__dirname, '..', '..', 'render/index.html')}`;
  if (is.dev()) {
    filePath = 'http://127.0.0.1:1702/';
  }
  return filePath;
}

function getNewPath(params) {
  let filePath = `file://${path.join(__dirname, '..', '..', 'render/book.html')}`;
  if (is.dev()) {
    filePath = 'http://127.0.0.1:1702/book.html';
  }
  return filePath;
}

module.exports = { getMainPath, getNewPath };
