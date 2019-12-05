import store from "store";

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
fs.stat('.setting', (err, data: string) => {
    if (err || !data.includes('ws')) {
        fs.writeFileSync('.setting', require('../setting').default)
        fs.writeFileSync('.defaultSetting', require('../setting').default)
    }
})
export default fs