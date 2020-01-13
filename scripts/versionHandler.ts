const { writeFile } = require('fs')
const { pkg: pkgPath } = require('../main/src/config/path')
delete require.cache[pkgPath];
const pkg: { version: string, description: string, [x: string]: any } = require(pkgPath)
const { version, description } = pkg

const arr = version.split('.')
const index = String(arr.length - 1)
arr[index] = ~~arr[index] + 1
const newVersion = pkg.version = arr.join('.')
writeFile(pkgPath, JSON.stringify(pkg, null, 2), (e:any) => console.log(e))
// return { version: newVersion, description }
