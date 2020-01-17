import store from "store";
const defaultSetting = require('../../main/asserts/defaultSetting.json')

const fs = {
    stat(path: string, cb) {
        const value = store.get(path)
        cb(!value, value)
    },
    readFile(path: string, encoding: string, cb: (err: any, value: string) => void) {
        const value = store.get(path)
        cb(null, value)
    },
    readFileSync(path: string) {
        return store.get(path)

    },
    writeFile(path: string, value: string, encoding: string, cb: (err: any) => void) {
        store.set(path, value)
        cb(null)
    },
    writeFileSync(path: string, value: string) {
        store.set(path, value)
    }
}
fs.stat('setting.json', (err, data: string) => {
    if (err || !data.includes('ws')) {
        fs.writeFileSync('setting.json', JSON.stringify(defaultSetting))
        fs.writeFileSync('defaultSetting.json', JSON.stringify(defaultSetting))
    }
})
export default fs