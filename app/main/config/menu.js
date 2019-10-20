const { Menu } = require('electron');
const hasMenus = false;

const menu = [
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

module.exports = hasMenus ? Menu.buildFromTemplate(menu) : null;