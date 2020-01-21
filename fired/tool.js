const path = require('path')
const fs = require('fs')
const c = require('child_process')

const { existsSync, unlinkSync, renameSync, rmdirSync } = fs
const { spawn, spawnSync } = c

const resourceResovle = p => path.resolve('..', p)

const nAsarPath = resourceResovle('./fired/app.asar.tmp')
const oAsarPath = resourceResovle('./app.asar')
const execPath = resourceResovle('../ctg-suit.exe')
const appDir = resourceResovle('app')



spawnSync('taskkill', ['/F', '/PID', process.ppid + ''])

existsSync(oAsarPath) && unlinkSync(oAsarPath)
existsSync(nAsarPath) && renameSync(nAsarPath, oAsarPath)
existsSync(appDir) && rmdirSync(appDir, { recursive: true })

existsSync(execPath) && spawn(execPath, { detached: true })

