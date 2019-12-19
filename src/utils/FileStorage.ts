import fs from 'fs'


export default class FileStorage {
    cache: { [x: string]: any } = {}
    resetObj = {}
    encoding = 'utf-8'
    path: string
    constructor(path, resetPath?: string, encoding = 'utf-8') {
        this.path = path
        this.encoding = encoding
        resetPath && new FileStorage(resetPath).getObj().then(obj => {
            this.resetObj = obj
        })
        this.getObjSync()
    }
    setCache(obj) {
        if (!obj) return;
        Object.assign(this.cache, obj)
    }
    box(obj: Object) {
        if (!obj || (obj.constructor !== Object)) return '';
        this.setCache(obj)
        return JSON.stringify(obj, null, 2)
    }
    deBox(str: string) {
        if (!str) {
            return {}
        }
        let obj: { [x: string]: any }

        try {
            obj = JSON.parse(str)
        } catch (error) {
            obj = {}
        }

        this.setCache(obj)
        return obj
    }
    _check(path) {
        fs.stat(path, err => {
            if (err) {
                fs.writeFile(path, '', this.encoding, () => { })
            }
        })
    }
    getString() {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(this.path, this.encoding, (err, res) => {
                if (!err) {
                    resolve(res)
                } else {
                    reject(err)
                }
            })

        })
    }
    getStringSync() {
        return fs.readFileSync(this.path, this.encoding)
    }
    getObj() {
        return new Promise((resolve, reject) => {
            this.getString().then(str => {
                resolve(this.deBox(str))
            }).catch(err => {
                reject(err)
            })

        })
    }
    getObjSync() {
        const str = this.getStringSync()
        return this.deBox(str)
    }

    _handleReadString(obj, key) {
        if (!Array.isArray(key)) {
            key = [key]
        }
        const result = []
        key.forEach(_ => {
            result.push(obj[_] || '')
        })
        return result.length < 2 ? result[0] : result
    }
    _handleWriteString(obj, key, value) {
        if (!Array.isArray(key)) {
            key = [key]
        }
        if (!Array.isArray(value)) {
            value = [value]
        }
        const o = { ...obj }
        key.forEach((k, index) => {
            const v = value[index] || ''
            o[k] = v
        })

        return this.box(o)
    }
    setSync(key, value) {
        const obj = this.getObjSync()
        const data = this._handleWriteString(obj, key, value)
        fs.writeFileSync(this.path, data, this.encoding)
    }
    set(key, value) {
        return new Promise((resolve, reject) => {
            this.getObj().then(obj => {
                const result = this._handleWriteString(obj, key, value)
                fs.writeFile(this.path, result, this.encoding, err => {
                    if (err) {
                        reject(err)
                        throw err
                    } else {
                        resolve(true)
                    }
                })

            }).catch(err => {
                reject(err)
                throw err

            })
        })
    }

    get(key) {
        return new Promise((resolve, reject) => {
            this.getObj().then(obj => {
                resolve(this._handleReadString(obj, key))
            }).catch(err => {
                reject(err)
                throw err

            })

        })
    }
    getSync(key) {
        let obj = this.getObjSync()
        return this._handleReadString(obj, key)
    }
    reset(keys) {
        if (!Array.isArray(keys)) {
            (keys) = [keys]
        }
        const values = [];

        keys.forEach(k => {
            values.push(this.resetObj[k] || '')
        });
        return new Promise((resolve, reject) => {
            this.set(keys, values).then(status => {
                resolve(status)
            }).catch(err => {
                reject(err)
            })
        })
    }
}