const { app } = require('electron')

module.exports = (myWindow) => new Promise((res, rej) => {

    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
        app.quit()
        rej()
    } else {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, we should focus our window.
            if (myWindow) {
                if (myWindow.isMinimized()) myWindow.restore()
                myWindow.focus()
            }
        })
        res(app)
    }
})