const fs = require('fs');
const path = require('path')
const http = require('http')
const execFile = require('child_process').execFile;
const printerPath = path.resolve(__dirname, '../libs/PDFtoPrinterSelect.exe')

module.exports = targetPath => {
    targetPath = targetPath === void 0 ? '.tmp.pdf' : targetPath
    const tmpPath = path.resolve(targetPath)

    return filePath => {
        const writeStream = fs.createWriteStream(tmpPath)
        const pdfPath = path.resolve(tmpPath)

        http.get(filePath, res => {
            if (res) {
                res.pipe(writeStream)
                const task = execFile(printerPath, [pdfPath]);
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
                task.on('error',(err)=>{
                    console.error(err)
                })
            } else {
                alert('request for pdf failed')
            }
        })
    }
}

