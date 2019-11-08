var path = require('path')
const http = require("http");
var moment = require('moment')
const request = require("request");
var progress = require('progress');
const glob = require('glob')
const yp = require('yargs-parser')
// var ProgressBar = require('progress');
const argv = process.argv
const args = yp(argv.slice(2))
const { serverHost } = args
// if (!serverHost) return

const cwd = process.cwd()
const resolve = p => path.resolve(cwd, p)
const pkg = require(resolve('package.json'))
const fs = require('fs')
const files = glob.sync('release/*.exe')
// if (files.length < 1) return
const target = files[0]
const fileStat = fs.statSync(target)
const total = fileStat.size


var bar = new progress('文件上传中[:bar] :rate/bps :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total
});

const options = {
    method: "POST",
    url: `http://${serverHost}/api/upload`,
    headers: {
        "Content-Type": "multipart/form-data"
    },
    formData: {
        "file": fs.createReadStream(target).on('data', chunk => bar.tick(chunk.length)),
        ...({
            // version: pkg.version,
            name: pkg.version,
            description: pkg.description,
            type: "ctg-suit",
            uri: pkg.version,
            // createTime: moment(new Date(fileStat.birthtime)).format('YYYY-MM-DD HH:mm:ss'),
            // enable: null
        })
    }
};
console.log(1111, JSON.stringify({
    name: pkg.version,
    description: pkg.description,
    type: "ctg-suit",
    uri: pkg.version,
    createTime: moment(new Date(fileStat.birthtime)).format('YYYY-MM-DD HH:mm:ss')
}, null, 2))

request(options, function (err, res, body) {
    if (err) console.log('err', err);
    console.log('body', body);
});
