const fs = require('fs');
const path = require('path')
const http = require('http')
const execFile = require('child_process').execFile;
const url = require('url')

const printerPath = path.resolve(__dirname, '../libs/PDFtoPrinterSelect.exe')

module.exports = targetDir => {
    targetDir = targetDir === void 0 ? '.tmp/' : targetDir
    const tmpDir = path.resolve(targetDir)
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir)
    }
    return fileUrl => {
        const dateTime = new Date().toLocaleString().replace(/[\/\s:]/g, (s) => { return '_' })
        const tmpName = `${dateTime}${url.parse(fileUrl).pathname.split('/').join('_')}`
        const tmpPath = path.resolve(tmpDir, `${tmpName}${tmpName.endsWith('.pdf') ? '' : '.pdf'}`)
        const writeStream = fs.createWriteStream(tmpPath).on('close', () => {
            const task = execFile(printerPath, [tmpPath]);
            task.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });
            task.on('close', (code) => {
                console.log(`write clonse: ${code}`);
            })
            task.on('error', (err) => {
                console.log(`write error: ${err}`);
            })
        })
        http.get(fileUrl, res => {
            if (res) {
                res.pipe(writeStream)
                res.on('end', () => {
                    writeStream.end()
                })
            }
        })
    }
}

