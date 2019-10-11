const fs = require('fs');
const path = require('path')
const http = require('http')
const execFile = require('child_process').execFile;
const url = require('url')

const printerPath = path.resolve(__dirname, '../libs/PDFtoPrinterSelect.exe')

module.exports = targetDir => {
    targetDir = targetDir === void 0 ? '.tmp/' : targetDir
    const tmpDir = path.resolve(targetDir)
    if(!fs.existsSync(tmpDir)){
        fs.mkdirSync(tmpDir)
    }
    return fileUrl => {
        const tmpName = url.parse(fileUrl).pathname.split('/').join('_')
        const tmpPath = path.resolve(tmpDir, tmpName)
        const writeStream = fs.createWriteStream(tmpPath)
        // const pdfPath = path.resolve(tmpDir)

        http.get(fileUrl, res => {
            if (res) {
                res.pipe(writeStream)
                setTimeout(() => {
                    writeStream.end()
                }, 10000);
                const task = execFile(printerPath, [tmpPath]);
                task.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                });
                task.stderr.on('data', (data) => {
                    console.log(`stderr: ${data}`);
                });
                task.on('close', (code) => {
                    console.log(`child process exited with code ${code}`);
                    // fs.unlink(pdfPath)
                })
                task.on('error', (err) => {
                    console.error(err)
                })
            } else {
                alert('request for pdf failed')
            }
        })
    }
}

