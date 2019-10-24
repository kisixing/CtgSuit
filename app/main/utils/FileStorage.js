const fs = require('fs')

function FileStorage(path, resetPath, encoding) {
    this.path = path
    this.encoding = encoding || 'utf-8'
    this.cache = {}
    resetPath && new FileStorage(resetPath).getObj().then(obj => {
        this.resetObj = obj
    })
    this.getObjSync()
}
FileStorage.prototype = {
    constructor: FileStorage,
    setCache(obj) {
        if (!obj) return;
        Object.assign(this.cache, obj)
    },
    box(obj) {
        if (!obj) return '';
        this.setCache(obj)
        return Object.entries(obj).map(_ => _.join('=')).join('\r\n')
    },
    deBox(str) {
        if (!str) {
            return []
        }
        const obj = str
            .split('\r\n')
            .filter(_ => !!_)
            .map(_ => _.split('='))
            .reduce((prev, curr) => {
                prev[curr[0]] = curr[1].trim()
                return prev
            }, {})
        this.setCache(obj)
        return obj
    },
    _check(path) {
        fs.stat(path, err => {
            if (err) {
                fs.writeFile(path, '', this.encoding, () => { })
            }
        })
    },
    getString() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, this.encoding, (err, res) => {
                if (!err) {
                    resolve(res)
                } else {
                    reject(err)
                }
            })

        })
    },
    getStringSync() {
        return fs.readFileSync(this.path, this.encoding)
    },
    getObj() {
        return new Promise((resolve, reject) => {
            this.getString().then(str => {
                resolve(this.deBox(str))
            }).catch(err => {
                reject(err)
            })

        })
    },
    getObjSync() {
        const str = this.getStringSync()
        return this.deBox(str)
    },

    _handleReadString(obj, key) {
        if (!Array.isArray(key)) {
            key = [key]
        }
        const result = []
        key.forEach(_ => {
            result.push(obj[_] || '')
        })
        return result.length < 2 ? result.join('') : result
    },
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
            o[k] = String(v)
        })

        return this.box(o)
    },
    setSnc(key, value) {
        const obj = this.getObjSync()
        const data = this._handleWriteString(obj, key, value)
        fs.writeFileSync(this.path, data, this.encoding)
    },
    set(key, value) {
        return new Promise((resolve, reject) => {
            this.getObj().then(obj => {
                const result = this._handleWriteString(obj, key, value)
                fs.writeFile(this.path, result, this.encoding, err => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(true)
                    }
                })

            }).catch(err => {
                reject(err)
            })
        })
    },

    get(key) {
        return new Promise((resolve, reject) => {
            this.getObj().then(obj => {
                resolve(this._handleReadString(obj, key))
            }).catch(err => {
                reject(err)
            })

        })
    },
    getSync(key) {
        let obj = this.getObjSync()
        return this._handleReadString(obj, key)
    },
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
module.exports = FileStorage
// module.exports = class FileStorage {
//     path = ''

//     constructor(path) {
//         this.path = path
//         this._check(path)
//     }
//     box() {

//     }
//     deBox(str) {
//         if (!str) {
//             return []
//         }
//         return str.split('\n').map(_ => _.split('='))
//     }
//     _check(path) {
//         fs.stat(path, err => {
//             if (err) {
//                 fs.writeFile(path, '', this.encoding, () => { })
//             }
//         })
//     }
//     getString() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(this.path, this.encoding, (err, res) => {
//                 if (!err) {
//                     resolve(res)
//                 } else {
//                     reject(err)
//                 }
//             })

//         })
//     }
//     getStringSync() {
//         return fs.readFileSync(this.path, this.encoding)
//     }
//     getEntries() {
//         return new Promise((resolve, reject) => {
//             this.getString().then(str => {
//                 resolve(this.deBox(str))
//             }).catch(err => {
//                 reject(err)
//             })

//         })
//     }
//     getEntriesSync() {
//         const str = this.getStringSync()
//         return this.deBox(str)
//     }

//     _handleReadString(arr, key) {
//         if (!Array.isArray(key)) {
//             key = [key]
//         }
//         const result = []
//         key.forEach(_ => {
//             arr.forEach(a => {
//                 if (a[0] === _) {
//                     result.push(a[1])
//                 }
//             })
//         })
//         return result.length < 2 ? result.join('') : result
//     }
//     _handleWriteString(_arr, key, value) {
//         if (!Array.isArray(key)) {
//             key = [key]
//         }
//         if (!Array.isArray(value)) {
//             value = [value]
//         }
//         const arr = [..._arr]
//         key.forEach((k, index) => {
//             const v = value[index] || ''
//             const target = arr.find(_ => _[0] === k)
//             if (target) {
//                 target[1] = v
//             } else {
//                 arr.push([k, v])
//             }
//         })


//         return arr.map(_ => _.join('=')).join('\n').trim()
//     }
//     setSnc(key, value) {
//         const arr = this.getEntriesSync()
//         const data = this._handleWriteString(arr, key, value)
//         fs.writeFileSync(this.path, data, this.encoding)
//     }
//     set(key, value) {
//         return new Promise((resolve, reject) => {
//             this.getEntries().then(arr => {
//                 const result = this._handleWriteString(arr, key, value)
//                 fs.writeFile(this.path, result, this.encoding, err => {
//                     if (err) {
//                         reject(err)
//                     } else {
//                         resolve(true)
//                     }
//                 })

//             }).catch(err => {
//                 reject(err)

//             })
//         })
//     }

//     get(key) {
//         return new Promise((resolve, reject) => {
//             this.getEntries().then(arr => {
//                 resolve(this._handleReadString(arr, key))
//             }).catch(err => {
//                 reject(err)
//             })

//         })
//     }
//     getSync(key) {
//         let arr = this.getEntriesSync()
//         return this._handleReadString(arr, key)
//     }
// }