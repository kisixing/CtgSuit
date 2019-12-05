// import fs from 'fs'

// export class Storage {
//     url: string
//     encoding = 'utf-8'
//     constructor(url: string) {
//         this.url = url

//         fs.stat(this.url, err => {
//             if (err) {
//                 fs.writeFile(this.url, '', this.encoding, () => { })
//             }
//         })

//     }
//     private _handleReadString(str: string, key: string | string[]): string | string[] {
//         if (!str) return '';
//         if (!Array.isArray(key)) {
//             key = [key]
//         }
//         const result = []
//         const arr = str.split('\n').map(_ => _.split('='))

//         key.forEach(_ => {
//             arr.forEach(a => {
//                 if (a[0] === _) {
//                     result.push(a[1])
//                 }
//             })
//         })

//         return result.length < 2 ? result.join('') : result
//     }
//     private _handleWriteString(str: string, key: string | string[], value: string | string[]): string {
//         if (!Array.isArray(key)) {
//             key = [key]
//         }
//         if (!Array.isArray(value)) {
//             value = [value]
//         }

//         const arr = str.split('\n').map(_ => _.split('='))
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
//     setSnc(key: string | string[], value: string | string[]) {
//         const res = fs.readFileSync(this.url, this.encoding)
//         const data = this._handleWriteString(res, key, value)
//         fs.writeFileSync(this.url, data, this.encoding)
//     }
//     set(key: string | string[], value: string | string[]) {
//         return new Promise<Boolean>((resolve, reject) => {
//             fs.readFile(this.url, this.encoding, (err, data) => {


//                 if (!err) {
//                     const result = this._handleWriteString(data, key, value)
//                     fs.writeFile(this.url, result, this.encoding, err => {
//                         if (err) {
//                             reject(err)
//                         } else {
//                             resolve(true)
//                         }
//                     })
//                 } else {
//                     reject(err)
//                 }
//             })
//         })
//     }

//     get(key: string | string[]) {
//         return new Promise((resolve, reject) => {
//             fs.readFile(this.url, this.encoding, (err, res) => {
//                 if (!err) {
//                     resolve(this._handleReadString(res, key))
//                 } else {
//                     reject(err)
//                 }
//             })

//         })
//     }
//     getSync(key: string | string[]) {
//         let res = fs.readFileSync(this.url, this.encoding)
//         return this._handleReadString(res, key)
//     }
// }
// export const store = new Storage('./.setting')