const path = require('path');
const is = require('electron-is');
function getMainPath() {
  let filePath = `${path.join(__dirname, '..', '..', 'render/index.html')}`;
  if (is.dev()) {
    console.log('----------开发环境----------');
    filePath = 'http://127.0.0.1:1702/';
  }
  return filePath;
}

function getNewPath(params) {
  let filePath = `file://${path.join(__dirname, '..', '..', 'render/handbook/index.html')}`;
  if (is.dev()) {
    filePath = 'http://127.0.0.1:1702/handbook/index.html';
  }
  return filePath;
}

function getPDFviewPath (params){
  let filePath = `file://${path.join(__dirname, '..', '..', 'render/pdfjs/web/viewer.html')}`;
  if (is.dev()) {
    filePath = 'http://127.0.0.1:1702/pdfjs/web/viewer.html';
  }
  return filePath;
}

module.exports = { getMainPath, getNewPath, getPDFviewPath };
