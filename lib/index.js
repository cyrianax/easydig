const Axios = require('axios')
const Jieba = require('nodejieba')
const Turndown = require('turndown')

class Easydig {
    constructor(options) {
        this.setRequestObj(options)
    }

    setRequestObj(options) {
        this.httpInstance = Axios.create({
            timeout: 30000,
        })
    }

    async dig(url, options) {
        let res = await this.fetch(url)
        console.log(res.data);
    }

    convert(str) {

    }

    fetch(url, options) {
        return this.httpInstance({
            url,
        })
    }

}

module.exports = Easydig
