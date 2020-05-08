import { audioPlayerPath, assetsPath } from '../config/path';
import { spawn, execFile } from "child_process";
import { logErr } from '../utils/log';
import { createConnection, Socket } from 'net';
import { resolve } from "path";

// const PIPE_NAME = "salamander_pipe";
const PIPE_NAME = "audiopipe";
const PIPE_PATH = "\\\\.\\pipe\\" + PIPE_NAME;
let client: Socket
function init() {
    let child = spawn(audioPlayerPath);
    if (child) {
        child
            .on('error', e => console.log('c err', e))
            .on('close', () => console.log('close'))
            .on('disconnect', () => console.log('disconnect'))
        child.stdout && child.stdout.on('data', d => console.log(d.toString()))

    }
}
init()


var stdin = process.openStdin();
stdin.on('data', function (data) {
    client.write(`${data}\r\n`);
});


export default (e, mode: string, options = { second: 0, docid: '' }) => {
    const { second = 0, docid = '' } = options
    let action = mode ? `${mode}#${options.second || 0}\r\n` : ''
    if (mode === 'load') {
        // action = `load#${docid}\r\n`
        action = `load#${resolve(assetsPath, './1.wav')}\r\n`
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