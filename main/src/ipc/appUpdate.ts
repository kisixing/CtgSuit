import { resources, unpackPath, config as configPath, pkg, tmp, appPath, execPath } from '../config/path';
import { createWriteStream, readFileSync, unlink, existsSync } from "fs";
import { spawn } from "child_process";
import { isDev } from "../utils/is";
import { log, logErr } from '../utils/log'
import { request } from "http";

const { dialog, app } = require('electron');
const { resolve } = require('path')

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

setInterval(() => {
  log(`flg-----------${f}`)
}, 6e4 / 2);

function appUpdate(e) {
  log(`--------------version-update 开始-------------------${isDev}`)
  if (f) return;
  if (isDev) return;
  f = true;
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
                      message: `检测到胎心监护新版${newV}，请点击〔确定〕完成升级`,
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
            reCall()
          }
        }
      });
      im.on('error', reCall)
    },
  )
    .on('error', reCall)
    .end();
}

function reCall() {
  f = false;
  setTimeout(appUpdate, 6e4);
}



export default appUpdate

function run(tgzPath, tarPath) {
  return gzip.uncompress(tgzPath, tarPath).then(() => {
    unlink(tgzPath, e => !!e && logErr(e.stack))
    tar.uncompress(tarPath, unpackPath).then(() => {
      unlink(tarPath, e => !!e && logErr(e.stack))
      dialog.showMessageBox({
        message: '应用更新成功，是否立即重启以生效?',
        buttons: ['cancel', 'ok'],
      }, _ => {
        if (_) {
          setTimeout(() => {
            checkAsar()
          }, 0);
        }
      })
    })
  })
}
function checkAsar() {
  const asarPkgPath = resolve(firePath, 'app.asar.tmp')
  const movePath = resolve(firePath, 'move.exe')
  const appDir = resolve(resources, 'app')
  if (existsSync(asarPkgPath) && existsSync(movePath)) {
    if (existsSync(appDir)) {
      rm(appDir, e => {
        !!e && logErr(e)
        spawn('taskkill', ['/F', '/PID', process.pid + ''])
      })
    } else {
      spawn('taskkill', ['/F', '/PID', process.pid + ''])
    }
    spawn(movePath, [appPath, asarPkgPath, execPath], { detached: true })
  } else {
    spawn(execPath, { detached: true })
    app.exit(0);
  }
}