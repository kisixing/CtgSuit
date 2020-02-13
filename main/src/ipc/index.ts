import { readdir } from 'fs';
const { ipcMain } = require('electron');

readdir(__dirname, (e, files) => {
    !e && (
        files.forEach(f => {
            const name = f.slice(0, f.lastIndexOf('.'))
            if (name === 'index') return
            const fn = require(`./${name}`).default
            ipcMain.on(name, fn)
        })
    )
})

export { }