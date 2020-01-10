const { config: configPath, pkg: pkgPath } = require('../config/path')
const fs = require('fs')
const v = (require(pkgPath) as any).version

fs.readFile(configPath, 'utf-8', (err, data) => {
    if (!err) {
        const config = JSON.parse(data)
        config.version = v
        fs.writeFile(configPath, JSON.stringify(configPath, null, 2), e => {
            throw e
        })
    } else {
        throw err
    }
})

export { }