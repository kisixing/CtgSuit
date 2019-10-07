import fs from 'fs'

export class Storage {
    url: string
    encoding='utf-8'
    constructor(url: string) {
        this.url = url
    }
    private _handleReadString(str: string, key: string): string {
        if (!str) return '';
        const arr = str.split('\n').map(_ => _.split('='))
        const target = arr.find(_ => _[0] === key) || []
        return target[1] || null
    }
    private _handleWriteString(str: string, key: string, value: string): string {

        const arr = str.split('\n').map(_ => _.split('='))
        const target = arr.find(_ => _[0] === key)
        if (target) {
            target[1] === value
        } else {
            arr.push([key, value])
        }
        return arr.map(_ => _.join('=')).join('\n').trim()
    }
    setSnc(key: string, value: string) {
        const res = fs.readFileSync(this.url, this.encoding)
        const data = this._handleWriteString(res, key, value)
        fs.writeFileSync(this.url, data, this.encoding)
    }
    set(key: string, value: string) {
        return new Promise((resolve, reject) => {
            fs.readFile(this.url, this.encoding, (err, data) => {
                reject(err)
                if (!err) {
                    const result = this._handleWriteString(data, key, value)
                    fs.writeFile(this.url, result, this.encoding, err => {
                        reject(err)
                    })
                }
            })
        })
    }

    getSync(key: string) {
        let res = ''
        try {
            res = fs.readFileSync(this.url, this.encoding)
        } catch (error) {
            fs.writeFileSync(this.url, '', this.encoding)
        }
        return this._handleReadString(res, key)
    }
}
export const store = new Storage('./.setting')