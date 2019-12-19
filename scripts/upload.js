const cp = require('child_process')
const yp = require('yargs-parser')
const fs = require('fs')
const path = require('path')
const pkgPath = path.resolve(__dirname, '../package.json')
const pkgStr = fs.readFileSync(pkgPath, 'utf-8')
const pkg = JSON.parse(pkgStr)
pkg.version = `1.${new Date().getMonth() + 1}.${new Date().getDate()}`
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

const argvs = yp(process.argv.slice(2))
const scriptName = argvs.target

const p = cp.spawn('dir')
p.stdout.on('data', d => console.log(d))
p.on('error',e=>console.log(e))