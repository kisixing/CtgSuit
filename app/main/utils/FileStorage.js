const fs = require('fs')

function FileStorage(url, encoding) {
    this.url = url
    this.encoding = encoding || 'utf-8'
}
FileStorage.prototype = {
    constructor:FileStorage,
    box() {

    },
    deBox(str) {
        if (!str) {
            return []
        }
        return str.split('\n').map(_ => _.split('='))
    },
    _check(url) {
        fs.stat(url, err => {
            if (err) {
                fs.writeFile(url, '', this.encoding, () => { })
            }
        })
    },
    getString() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.url, this.encoding, (err, res) => {
                if (!err) {
                    resolve(res)
                } else {
                    reject(err)
                }
            })

        })
    },
    getStringSync() {
        return fs.readFileSync(this.url, this.encoding)
    },
    getEntries() {
        return new Promise((resolve, reject) => {
            this.getString().then(str => {
                resolve(this.deBox(str))
            }).catch(err => {
                reject(err)
            })

        })
    },
    getEntriesSync() {
        const str = this.getStringSync()
        return this.deBox(str)
    },

    _handleReadString(arr, key) {
        if (!Array.isArray(key)) {
            key = [key]
        }
        const result = []
        key.forEach(_ => {
            arr.forEach(a => {
                if (a[0] === _) {
                    result.push(a[1])
                }
            })
        })
        return result.length < 2 ? result.join('') : result
    },
    _handleWriteString(_arr, key, value) {
        if (!Array.isArray(key)) {
            key = [key]
        }
        if (!Array.isArray(value)) {
            value = [value]
        }
        const arr = [..._arr]
        key.forEach((k, index) => {
            const v = value[index] || ''
            const target = arr.find(_ => _[0] === k)
            if (target) {
                target[1] = v
            } else {
                arr.push([k, v])
            }
        })


        return arr.map(_ => _.join('=')).join('\n').trim()
    },
    setSnc(key, value) {
        const arr = this.getEntriesSync()
        const data = this._handleWriteString(arr, key, value)
        fs.writeFileSync(this.url, data, this.encoding)
    },
    set(key, value) {
        return new Promise((resolve, reject) => {
            this.getEntries().then(arr => {
                const result = this._handleWriteString(arr, key, value)
                fs.writeFile(this.url, result, this.encoding, err => {
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
            this.getEntries().then(arr => {
                resolve(this._handleReadString(arr, key))
            }).catch(err => {
                reject(err)
            })

        })
    },
    getSync(key) {
        let arr = this.getEntriesSync()
        return this._handleReadString(arr, key)
    }
}
module.exports = FileStorage
// module.exports = class FileStorage {
//     url = ''

//     constructor(url) {
//         this.url = url
//         this._check(url)
//     }
//     box() {

//     }
//     deBox(str) {
//         if (!str) {
//             return []
//         }
//         return str.split('\n').map(_ => _.split('='))
//     }
//     _check(url) {
//         fs.stat(url, err => {
//             if (err) {
//                 fs.writeFile(url, '', this.encoding, () => { })
//             }
//         })
//     }
//     getString() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(this.url, this.encoding, (err, res) => {
//                 if (!err) {
//                     resolve(res)
//                 } else {
//                     reject(err)
//                 }
//             })

//         })
//     }
//     getStringSync() {
//         return fs.readFileSync(this.url, this.encoding)
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
//         fs.writeFileSync(this.url, data, this.encoding)
//     }
//     set(key, value) {
//         return new Promise((resolve, reject) => {
//             this.getEntries().then(arr => {
//                 const result = this._handleWriteString(arr, key, value)
//                 fs.writeFile(this.url, result, this.encoding, err => {
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