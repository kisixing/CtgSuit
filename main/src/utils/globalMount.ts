import { BrowserWindow } from "electron";

const constant = require('../config/constant');
const FileStorage = require('./FileStorage');

export const globalMount = () => {
    Object.assign(global, { constant, FileStorage })
}

export const collecWebContentsId = (key: string, win: BrowserWindow) => {
    const id = win.webContents
    const wins = (global as any).windows || ((global as any).windows = {})
    wins[key] = id
    console.log('webcontent id', key, id.id)
}