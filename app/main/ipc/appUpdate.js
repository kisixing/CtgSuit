const { dialog, app } = require('electron');
const { createWriteStream, mkdirSync, existsSync, readFileSync, unlink } = require('fs');
const { request } = require('http')
const { resolve } = require('path')
const { log, logErr } = require('../utils/log')
const { resources, config: configPath, pkg, tmp } = require('../config/path')
const { isDev } = require('../utils/is')



delete require.cache[pkg];


const version = require(pkg).version

const config = JSON.parse(readFileSync(configPath, 'utf-8'))
const xhr_url = config.xhr_url

if (!(xhr_url && version)) return



const compress = require('compressing')
const { tar, gzip } = compress






let f = false
function appUpdate(e) {
    if (f) return
    f = true
    log(`version-update 开始`)

    request(`http://${xhr_url}/api/version-compare/ctg-suit/${version}`, im => {
        im.on('readable', () => {
            const res = im.read()
            log(`version-compare:${version}:${res}`)

            if (res) {
                const { uri: filename, enable, name: newV } = JSON.parse(res.toString())
                if (filename && newV) {
                    const tgzPath = resolve(tmp, filename)
                    const tarPath = resolve(tmp, `${filename}.tar`)
                    const writeStream = createWriteStream(tgzPath)
                        .on('close', () => {
                            f = false
                            enable ? run(tgzPath, tarPath) : (
                                dialog.showMessageBox({
                                    message: '检测到新版本，是否后台安装',
                                    buttons: ['cancel', 'ok'],
                                }, _ => {
                                    _ && run(tgzPath, tarPath)
                                })
                            )
                        })

                    request(`http://${xhr_url}/api/version-uri/${filename}`, im => im.pipe(writeStream)).end()
                }
            }

        })
    }).end()


}





module.exports = ['ready', appUpdate]
appUpdate()
function run(tgzPath, tarPath) {
    return gzip.uncompress(tgzPath, tarPath).then(() => {
        tar.uncompress(tarPath, isDev ? tmp : resources).then(() => {
            unlink(tarPath, e => !!e && logErr(e.stack))
            dialog.showMessageBox({
                message: '应用更新成功，是否立即重启以生效？' + app.getVersion(),
                buttons: ['cancel', 'ok'],
            }, _ => {
                if (_) {
                    // e.sender.send('installed')
                    // getMainWindow().reload()
                    app.exit(0);
                    app.relaunch();
                }
            });
        });
    });
}

