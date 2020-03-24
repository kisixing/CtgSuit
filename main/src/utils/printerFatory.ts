import { log } from "./log";
import { get } from "http";
import { tmp, config } from "../config/path";
const fs = require('fs');
const path = require('path')
const execFile = require('child_process').execFile;
const url = require('url')
const printerPath = require('../config/constant').PRINTER_PATH

export const printerFatory = targetDir => {
    const tmpDir = targetDir === void 0 ? tmp : path.resolve(targetDir)

    return fileUrl => {
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir)
        }
        log(`pdf:file ${fileUrl}`)
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
        get(fileUrl, { headers: { Authorization: require(config).Authorization } }, res => {
            if (res) {
                res.pipe(writeStream)
                res.on('end', () => {
                    writeStream.end()
                })
            }
        }).on('error', e => console.log('eee', e))
    }
}

