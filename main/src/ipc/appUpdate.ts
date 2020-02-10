import { resources, unpackPath, config as configPath, pkg, tmp, appPath, execPath } from '../config/path';
import { createWriteStream, readFileSync, unlink, existsSync, unlinkSync, rmdirSync, rmdir } from "fs";
import { spawnSync, spawn } from "child_process";
const { dialog, app } = require('electron');
const is = require('electron-is');
const { request } = require('http')
const { resolve } = require('path')
const { log, logErr } = require('../utils/log')
// const { isDev } = require('../utils/is')

const rm = require('rimraf')

delete require.cache[pkg];


const version = (require(pkg) as any).version

const config = JSON.parse(readFileSync(configPath, 'utf-8'))
const xhr_url = config.xhr_url

if (!(xhr_url && version)) throw 'eee'



const compress = require('compressing')
const { tar, gzip } = compress


const firePath = resolve(resources, 'fired')




let f = false
function appUpdate(e) {
  if (f) return;
  if (is.dev()) return;
  f = true;
  log(`version-update 开始`)
  request(
    `http://${xhr_url}/api/version-compare/ctg-suit/${version}`,
    im => {
      im.on('readable', () => {
        const res = im.read();
        log(`version-compare:${version}:${res}`);

        if (res) {
          const { uri: filename, enable, name: newV } = JSON.parse(
            res.toString(),
          );
          if (filename && newV) {
            const tgzPath = resolve(tmp, filename);
            const tarPath = resolve(tmp, `${filename}.tar`);
            const writeStream = createWriteStream(tgzPath).on(
              'close',
              () => {
                enable
                  ? run(tgzPath, tarPath)
                  : dialog.showMessageBox(
                    {
                      message: `检测到胎心监护新版${newV}，请点击〔确定〕完成升级?`,
                      buttons: ['cancel', 'ok'],
                    },
                    _ => {
                      f = false;
                      _ && run(tgzPath, tarPath)
                    },
                  );
              },
            );

            request(`http://${xhr_url}/api/version-uri/${filename}`, im =>
              im.pipe(writeStream),
            ).end();
          } else {
            f = false;
            setTimeout(appUpdate, 6e4);
          }
        }
      });
    },
  ).end();
}





export default ['ready', appUpdate]

function run(tgzPath, tarPath) {
  // existsSync(firePath) && rm(firePath, e => !!e && logErr(e))

  return gzip.uncompress(tgzPath, tarPath).then(() => {
    unlink(tgzPath, e => !!e && logErr(e.stack))
    tar.uncompress(tarPath, unpackPath).then(() => {
      unlink(tarPath, e => !!e && logErr(e.stack))
      // rename(appPath, resolve(appPath, '../app1.asar'), e => !!e && logErr(e.stack))

      dialog.showMessageBox({
        message: '应用更新成功，是否立即重启以生效?',
        buttons: ['cancel', 'ok'],
      }, _ => {
        if (_) {
          // e.sender.send('installed')
          // getMainWindow().reload()
          setTimeout(() => {
            // app.relaunch();
            // app.exit();
            checkAsar()
          }, 0);
        }
      });
    });
  });
}
console.log(process.pid)
function checkAsar() {
  log(`checkAsar`)

  const asarPkgPath = resolve(firePath, 'app.asar.tmp')
  const movePath = resolve(firePath, 'move.exe')
  const appDir = resolve(resources, 'app')
  if (existsSync(asarPkgPath) && existsSync(movePath)) {
    log('gggggggggggg')
    log(`${appPath}, ${asarPkgPath}, ${execPath}`)
    if (existsSync(appDir)) {
      rm(appDir, e => {
        !!e && logErr(e)
        spawn('taskkill', ['/F', '/PID', process.pid + ''])
      })
    } else {
      spawn('taskkill', ['/F', '/PID', process.pid + ''])
    }
    spawn(movePath, [appPath, asarPkgPath, execPath], {
      detached: true
    })
  } else {
    spawn(execPath, {
      detached: true
    })
    spawn('taskkill', ['/F', '/PID', process.pid + ''])
  }

  // app.exit(0)
  // spawn('taskkill', ['/F', '/PID', process.ppid + ''])

  // process.kill(0)
  // console.log(process.pid)
  // setInterval(() => {
  //   console.log(process.pid)
  // }, 1000);

}