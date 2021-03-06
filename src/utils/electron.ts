import { EventEmitter } from "@lianmed/utils";

class E extends EventEmitter {
    constructor() {
        super()
    }
    send(name: string, ...args) {
        this.emit(name, args)
    }
    on(name: string, fn: any) {
        super.on(name, fn)
        return this
    }
}
const ipcRenderer = new E()
    .on('printWindow', (url) => {
        window.open(url)
    })
    .on('newWindow',()=>{
        window.open('/handbook/index.html')
    })


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