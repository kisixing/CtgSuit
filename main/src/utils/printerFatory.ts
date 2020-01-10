const fs = require('fs');
const path = require('path')
const http = require('http')
const execFile = require('child_process').execFile;
const url = require('url')
const printerPath = require('../config/constant').PRINTER_PATH
const { tmp } = require('../config/path')

export default targetDir => {
    const tmpDir = targetDir === void 0 ? tmp : path.resolve(targetDir)

    return fileUrl => {
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir)
        }
        const dateTime = new Date().toLocaleDateString().replace(/[\/\s:]/g, (s) => { return '_' })
        const dateTimeDir = path.resolve(tmpDir, dateTime)
        if (!fs.existsSync(dateTimeDir)) {
            fs.mkdirSync(dateTimeDir)
        }
        const tmpName = url.parse(fileUrl).pathname.slice(1).split('/').join('_')
        const tmpPath = path.resolve(dateTimeDir, `${tmpName}${tmpName.endsWith('.pdf') ? '' : '.pdf'}`)
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
        console.log('file', fileUrl, '\n')
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

