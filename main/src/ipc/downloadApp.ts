const { dialog } = require('electron');
const { createWriteStream, mkdirSync, existsSync } = require('fs');
const { request } = require('http')
const { resolve } = require('path')
const { parse } = require('url')
const { exec } = require('child_process')
// export default () => {
//     ipcMain.on('downloadApp', appDownload)
// }

export default appDownload

function appDownload(e, url = '') {
    const { pathname } = parse(url)
    const filename = pathname.slice(pathname.lastIndexOf('/') + 1)
    const insDir = resolve(process.env.USERPROFILE, 'Desktop')
    const filePath = resolve(insDir, filename)

    existsSync(insDir) || mkdirSync(insDir)

    const writeStream = createWriteStream(filePath)
        .on('close', () => {
            e.sender.send('appDownloaded')
            dialog.showMessageBox({
                message: '下载完成，是否进行安装？',
                buttons: ['cancel', 'ok'],
            }, _ => exec(`explorer ${_ ? filePath : insDir}`))
        })
    request(url, incomingMessage => incomingMessage.pipe(writeStream)).end()

}