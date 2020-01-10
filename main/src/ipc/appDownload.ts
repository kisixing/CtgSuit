const { ipcMain, dialog } = require('electron');
const { createWriteStream, mkdirSync, existsSync } = require('fs');
const { request } = require('http')
const { resolve } = require('path')
const { parse } = require('url')
const { exec } = require('child_process')
export default () => {
    ipcMain.on('\u0064\u006f\u0077\u006e\u006c\u006f\u0061\u0064\u0041\u0070\u0070', appDownload)
}
function appDownload(e, url = '') {
    const { pathname } = parse(url)
    const filename = pathname.slice(pathname.lastIndexOf('/') + 1)
    const insDir = resolve(process.env.USERPROFILE, 'Desktop')
    const filePath = resolve(insDir, filename)

    existsSync(insDir) || mkdirSync(insDir)

    const writeStream = createWriteStream(filePath)
        .on('close', () => {
            e.sender.send('\u0061\u0070\u0070\u0044\u006f\u0077\u006e\u006c\u006f\u0061\u0064\u0065\u0064')
            dialog.showMessageBox({
                message: '下载完成，是否进行安装？',
                buttons: ['cancel', 'ok'],
            }, _ => exec(`explorer ${_ ? filePath : insDir}`))
        })
    request(url, incomingMessage => incomingMessage.pipe(writeStream)).end()

}