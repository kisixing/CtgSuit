const { writeFile } = require('fs')
const { pkg: pkgPath } = require('../app/main/config/path')
const pkg = require(pkgPath)
const { version, description } = pkg
exports.getVersionMessage = () => {
    const arr = version.split('.')
    const len = arr.length
    arr[len - 1] = ~~arr[len - 1] + 1
    const newVersion = pkg.version = arr.join('.')
    writeFile(pkgPath, JSON.stringify(pkg, null, 2), e => console.log(e))
    return { version: newVersion, description }
}