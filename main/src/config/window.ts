const path = require('path');
const is = require('electron-is');
function getMainPath() {
  let filePath = `${path.join(__dirname, '..', '..', 'render/index.html')}`;
  if (is.dev()) {
    filePath = 'http://127.0.0.1:1702/';
  }
  return filePath;
}

function getNewPath() {
  let filePath = `file://${path.join(__dirname, '..', '..', 'render/handbook/index.html')}`;
  if (is.dev()) {
    filePath = 'http://127.0.0.1:1702/handbook/index.html';
  }
  return filePath;
}



export { getMainPath, getNewPath };
