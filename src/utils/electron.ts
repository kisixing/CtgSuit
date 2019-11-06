import { EventEmitter } from "@lianmed/utils";

class E extends EventEmitter {
    constructor() {
        super()
    }
    send(name: string, ...args) {
        console.log('electron send', name)

        this.emit(name, args)
    }
    on(name: string, fn: any) {
        console.log('electron on', name)
        this.on(name, fn)
        return this
    }
}
const ipcRenderer = new E()
const remote = {
    getGlobal(name: string) {
        const a = {
            constant: {
                SETTING_PATH: '.setting',
                DEFAULT_SETTING_PATH: '.defaultSetting'
            }

        }
        return a[name]
    }
}
export {
    ipcRenderer,
    remote
}