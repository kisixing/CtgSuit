import { audioPlayerPath, assetsPath, tmp, config as configPath } from '../config/path';
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { logErr, log } from '../utils/log';
import { createConnection, Socket } from 'net';
import { resolve } from "path";
import { Parser, Builder } from 'xml2js'

const c = require(configPath)
const xhr_url = c.xhr_url
const fs = require('fs')
//xml2js默认会把子子节点的值变为一个数组, explicitArray设置为false
var xmlParser = new Parser()
//json->xml
var jsonBuilder = new Builder();
// const PIPE_NAME = "salamander_pipe";
const PIPE_NAME = "audiopipe";
const PIPE_PATH = "\\\\.\\pipe\\" + PIPE_NAME;
let client: Socket
let child: ChildProcessWithoutNullStreams
function init() {
    config()
    child = spawn(audioPlayerPath, { cwd: tmp });
    if (child) {
        child
            .on('error', e => console.log('c err', e))
            .on('close', () => console.log('close'))
            .on('disconnect', () => console.log('disconnect'))
            .on('message', d => console.log(d.toString()))
        child.stdout && child.stdout.on('data', d => console.log('data', d.toString()))
        child.stdin && child.stdin.on('data', d => console.log('data', d.toString()))
    }
}
export function kill() {
    child && child.kill()
}
init()


var stdin = process.openStdin();
stdin.on('data', function (data) {
    client.write(`${data}\r\n`);
});


export default (e, mode: string, options: { second?: number, filePath?: string, audioId?: string } = { second: 0, audioId: '', filePath: '' }) => {
    const { second = 0, audioId = '', filePath = '' } = options
    let action = mode ? `${mode}#${options.second || 0}\r\n` : ''
    if (mode === 'load') {
        // action = `load#${audioId}\r\n`
        action = `load#${audioId}\r\n`
    } else if (mode === 'print') {
        action = `print#${filePath}\r\n`
    }
    console.log('audioPlay', action)
    if (!client) {
        console.log('connect', PIPE_PATH)

        client = createConnection({ path: PIPE_PATH, timeout: 9000 }, () => {
            client.write(action)
        })
            .on('data', d => {
                d && e.sender.send('audioPlay', d.toString())

            })
            .on('error', e => {
                console.log('client err', e)
                //@ts-ignore
                client = null
            })
            .on('end', () => {
                console.log('client end');
                //@ts-ignore
                client = null
            })
            .on('close', () => {
                console.log('client close')
                //@ts-ignore
                client = null
            })

        console.log('connect', mode, options)

    } else {

        client.write(action)
    }
}


function config() {

    const p = resolve(audioPlayerPath, '../ClientService.exe.config')
    log(`config clientservice ${xhr_url}, ${p}`)
    const res = xmlParser.parseStringPromise(fs.readFileSync(p))
    res.then(r => {
        const adds = r.configuration.appSettings[0].add
        const t1 = adds.find(_ => _['$'].key === 'baseurl')
        t1.$.value = `http://${xhr_url}/api/`
        const t2 = adds.find(_ => _['$'].key === 'storepath')
        t2.$.value = tmp
        const s = jsonBuilder.buildObject(r)
        fs.writeFileSync(p, s)
    })
}
