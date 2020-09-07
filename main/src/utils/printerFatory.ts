import { log } from "./log";
import { get } from "http";
import { tmp, config as configPath } from "../config/path";
import clientServer from "../ipc/audioPlay";

const config = require(configPath)
const fs = require('fs');
const path = require('path')
const execFile = require('child_process').execFile;
const url = require('url')
const printerPath = require('../config/constant').PRINTER_PATH

export const printerFatory = targetDir => {
    const tmpDir = targetDir === void 0 ? tmp : path.resolve(targetDir)

    return (fileUrl: string) => {
        fileUrl = fileUrl.includes('http:') ? fileUrl : `http://${fileUrl}`
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

            if (config && config.printDirect) {
                clientServer(null, 'print', { filePath: tmpPath })
            } else {
                execFile(printerPath, [tmpPath]);

            }
        })
        console.log('print', fileUrl)
        get(fileUrl, res => {
            if (res) {
                res.pipe(writeStream)
                res.on('end', () => {
                    writeStream.end()
                })
            }
        }).on('error', e => console.log('eee', e))
    }
}

