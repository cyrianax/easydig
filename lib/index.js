const _ = require('lodash')
const Axios = require('axios')
const Cheerio = require('cheerio')
const Jieba = require('nodejieba')
const Turndown = require('turndown')

class Easydig {
    constructor(options) {
        this.options = options
        this.options.topN = this.options.topN || 5

        this.setRequestObj(options)
        this.setTurndownObj(options)
    }

    // 生成并设置请求实例
    // 设置随机user-agent & 随机代理 （待完成）
    setRequestObj(options = {}) {
        options.headers = options.headers || {
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.139 Chrome/66.0.3359.139 Safari/537.36'
        }
        this.request = Axios.create(options)
    }

    // 生成并设置Turndown实例
    setTurndownObj(options = {}) {
        options.codeBlockStyle = options.codeBlockStyle || 'fence'
        this.convertor = new Turndown(options)
    }

    // 从远程地址挖掘文本
    // 批量抓取逻辑 (待完成)
    async dig(url, options) {
        try {
            let res = await this.request({
                url,
                ...options
            })
            return this.convert(res.data, options)
        }
        catch (err) {
            return err
        }
    }

    // 转换文本
    convert(str, options = {}) {
        options.markdown = typeof options.markdown === 'undefined' ? this.options.markdown : options.markdown
        options.keywords = typeof options.keywords === 'undefined' ? this.options.keywords : options.keywords
        options.topN = typeof options.topN === 'undefined' ? this.options.topN : options.topN

        const $ = Cheerio.load(str, {
            decodeEntities: false,
            xmlMode: true
        })

        // 清除不需要的标签
        let needClearTags = ['applet', 'area', 'aside', 'audio', 'button', 'canvas', 'command', 'datalist', 'dialog', 'embed', 'fieldset', 'form', 'frame', 'frameset', 'iframe', 'input', 'keygen', 'label', 'legend', 'link', 'map', 'menu', 'menuitem', 'noframes', 'noscript', 'object', 'optgroup', 'option', 'output', 'param', 'progress', 'rp', 'rt', 'ruby', 'script', 'select', 'source', 'style', 'textarea', 'track', 'video']
        needClearTags.forEach(tag => {
            $(tag).remove()
        })

        // 获取标题
        let title = $('title').text()
        // 获取内容
        let content = options.selector ? $(options.selector).html() : $.html()
        // 清除注释
        content = content.replace(/<!--[\s\S]*?-->/, '')
        // 获取Markdown格式化内容
        let md = options.markdown ? this.convertor.turndown(content) : ''
        // 获取关键词
        let keywords
        if (options.keywords) {
            let text = md || this.convertor.turndown(content)
            let titleKeywords = Jieba.extract(title, options.topN)
            let contentKeywords = Jieba.extract(text, options.topN)
            keywords = _.concat(titleKeywords, contentKeywords)
            keywords = _.uniq(keywords)
        }

        return {title, keywords, content, md}
    }
}

module.exports = Easydig
