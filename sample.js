const Easydig = require('./lib')

const digger = new Easydig({
    markdown: true,
    keywords: true,
    topN: 20
})

digger.dig('https://www.jianshu.com/p/815788f4b01d', {
    selector: '.show-content'
})
.then(result => {
    console.log(result)
})
.catch(error => {
    console.log(error)
})
