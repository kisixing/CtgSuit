import { remote } from 'electron'
const FileStorage = remote.getGlobal('FileStorage')
const constant = remote.getGlobal('constant')

const {
    SETTING_PATH,
    DEFAULT_SETTING_PATH
} = constant
const defaultSetting = new FileStorage(DEFAULT_SETTING_PATH)
const store = new FileStorage(SETTING_PATH)

defaultSetting.getEntries().then(arr => {
    store.defaultEntries = arr
})
store.reset = (keys: string[] | string) => {
    if (!Array.isArray(keys)) {
        (keys) = [keys]
    }
    const values = [];

    (keys as string[]).forEach(k => {
        const target = store.defaultEntries.find(_ => _[0] === k)
        if (target) {
            values.push(target[1])
        } else {
            values.push('')
        }
    });
    return new Promise((resolve, reject) => {
        store.set(keys, values).then(status => {
            resolve(status)
        }).catch(err => {
            reject(err)
        })
    })
}
console.log('defaultSetting', defaultSetting, store)

export default store