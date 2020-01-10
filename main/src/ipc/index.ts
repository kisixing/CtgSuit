const fs = require('fs')
const { ipcMain } = require('electron');

fs.readdir(__dirname, (e, files) => {
    !e && (
        files.forEach(f => {
            if (f === 'index.js') return
            const args = require(`./${f}`).default
            if (Array.isArray(args)) {
                ipcMain.on(args[0], args[1])
            }

        })
    )
})

export { }