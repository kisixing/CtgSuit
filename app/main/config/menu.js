const { Menu } = require('electron');
const log = require('electron-log');

function getTemplate() {
  return [
    {
      label: 'MyApp',
      submenu: [
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      role: 'window',
      label: 'Window',
      submenu: [{ role: 'minimize' }, { role: 'close' }],
    },
  ];
}

function init() {
  log.info('(menu) init');
  const menu = Menu.buildFromTemplate(getTemplate());
  // Menu.setApplicationMenu(menu);
  Menu.setApplicationMenu(menu);
}

module.exports = {
  init,
};