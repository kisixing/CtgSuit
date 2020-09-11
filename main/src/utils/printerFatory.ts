import { log } from "./log";
import { get } from "http";
import { tmp, config as configPath } from "../config/path";
import clientServer from "../ipc/audioPlay";
import {existsSync,mkdirSync,createWriteStream } from 'fs'
const config = require(configPath)
const path = require('path')
const execFile = require('child_process').execFile;
const url = require('url')
const printerPath = require('../config/constant').PRINTER_PATH

export const printerFatory = targetDir => {
    const tmpDir = targetDir === void 0 ? tmp : path.resolve(targetDir)

    return (fileUrl: string) => {
        fileUrl = fileUrl.includes('http:') ? fileUrl : `http://${fileUrl}`
        if (!existsSync(tmpDir)) {
            mkdirSync(tmpDir)
        }
        log(`pdf:file ${fileUrl}`)
        const dateTime = new Date().toLocaleDateString().replace(/[\/\s:]/g, (s) => { return '_' })
        const dateTimeDir = path.resolve(tmpDir, dateTime)
        if (!existsSync(dateTimeDir)) {
            mkdirSync(dateTimeDir)
        }
        const tmpName = url.parse(fileUrl).pathname.slice(1).split('/').join('_')
        const tmpPath = path.resolve(dateTimeDir, `${tmpName}${tmpName.endsWith('.pdf') ? '' : '.pdf'}`)
        const writeStream = createWriteStream(tmpPath).on('close', () => {

            if (config && config.printDirect) {
                clientServer(null, 'print', { filePath: tmpPath })
            } else {
                execFile(printerPath, [tmpPath]);

            }
        })
        console.log('print', fileUrl)
        get(fileUrl, res => {
            
            if (res && res.statusCode === 200) {
                res.pipe(writeStream)
                res.on('end', () => {
                    writeStream.end()
                })
            }
        }).on('error', e => console.log('eee', e))
    }
}

