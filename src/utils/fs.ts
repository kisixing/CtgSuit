import store from "store";

const fs = {
    stat(path: string, cb) {
        const value = store.get(path)
        cb(!value)
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
fs.stat('.setting', (err) => {
    if (err) {
        fs.writeFile('.setting', require('../setting').default, '', () => { })
    }
})
export default fs