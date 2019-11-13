const { ipcMain, dialog } = require('electron');
const { createWriteStream, mkdirSync, existsSync } = require('fs');
const { request } = require('http')
const { resolve } = require('path')
const { parse } = require('url')
const { exec } = require('child_process')
module.exports = () => {
    ipcMain.on('\u0064\u006f\u0077\u006e\u006c\u006f\u0061\u0064\u0041\u0070\u0070', appDownload)
}
function appDownload(e, url = '') {
    const { pathname, hostname, port, href } = parse(url)
    console.log(1111,e)

    const filename = pathname.slice(pathname.lastIndexOf('/') + 1)
    const insDir = resolve(process.env.USERPROFILE, 'Desktop')
    const filePath = resolve(insDir, filename)

    existsSync(insDir) || mkdirSync(insDir)


    const r = request({ hostname, port, pathname }, res => {
        res.pipe(createWriteStream(filePath)).on('close', () => {
            e.sender.send('\u0061\u0070\u0070\u0044\u006f\u0077\u006e\u006c\u006f\u0061\u0064\u0065\u0064')
            dialog.showMessageBox({
                message: '\u4e0b\u8f7d\u5b8c\u6210\uff0c\u662f\u5426\u8fdb\u884c\u5b89\u88c5\uff1f',
                buttons: ['cancel', 'ok'],
            }, resNum => exec(resNum ? filePath : `explorer ${insDir}`))
        })
    })
    r.end()

}
