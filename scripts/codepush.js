const { existsSync, mkdirSync, unlinkSync, createReadStream, readFileSync, statSync } = require('fs')
const path = require('path')
const yp = require('yargs-parser')
const request = require("request");
var progress = require('progress');
const compress = require('compressing')
const { config: configPath, pkg: pkgPath } = require('../app/main/config/path')

const { tar: { compressDir }, gzip: { compressFile } } = compress
const { target, dir, base } = yp(process.argv.slice(2))

const config = JSON.parse(readFileSync(configPath, 'utf-8'))



delete require.cache[pkgPath];
const pkg = require(pkgPath)
const { version, description } = pkg

const { USERNAME: username } = process.env


if (!target) return
existsSync(dir) || mkdirSync(dir)

const dateTime = new Date().toLocaleString().replace(/[:]/g, '-')
const rPath = path.resolve(base)
const tarName = path.resolve(dir, `${target}`)
const tgzName = path.resolve(dir, `${target} ${version} ${dateTime} ${username}`)

compressDir(rPath, tarName).then(v => {
    compressFile(tarName, tgzName).then(() => {
        unlinkSync(tarName)
        flash(tgzName)
    })
})



function flash(target) {
    const fileStat = statSync(target);
    const total = fileStat.size;
    var bar = new progress(`${version}上传中[:bar] :rate/bps :percent :etas`, {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total
    });
    const options = {
        method: "POST",
        url: `http://${'192.168.123.10:9987'||config.xhr_url}/api/upload`,
        headers: {
            "Content-Type": "multipart/form-data"
        },
        formData: {
            file: createReadStream(target).on('data', chunk => bar.tick(chunk.length)),
            name: version,
            description: `${username} 打的包`,
            type: "ctg-suit",
            uri: version,
        }
    };
    request(options, function (err, res, body) {
        if (err) console.log('err', err);
    });
}