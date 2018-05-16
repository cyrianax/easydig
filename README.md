# Easydig

“易用的内容采集与分析处理工具”
*--以上是本库的一个小小的、美好的愿景*

## 简述
__Easydig__是一个用于采集指定Url下的文章内容，并进行简单处理（去除无用标签、转换标准Markdown格式、分析内容抽取关键词）的工具库

在现阶段，初期版本的Easydig仅仅基于Turndown、NodeJieba等库做了简单的封装。

在接下来的时间里，我想我会逐步完善它，并将学习NLP获得的粗浅知识应用进去。

~~嗯，挖坑无止境，填坑看心情~~

## 安装
- 由于Nodejieba使用了Node C++扩展，所以你可能需要先安装相关依赖，如已配置可以忽略此步骤：
```
sudo apt install make
sudo apt install g++
sudo npm install node-gyp -g
```
- 安装easydig
```
npm insall easydig
```

## 快速开始
```javascript
const easydig = require('easydig')
const digger = new easydig({
    markdown: true,     // 将内容转化为markdown格式，默认为false
    keywords: true      // 基于标题和内容提取关键词，默认为false
})

digger.dig('http://...', {
    selector: '...'
})
```

## 方法
### dig(url, [options])
dig方法用于采集远程地址的文章内容。它接收一个url地址和可选的options设置，并返回一个Promise
```javascript
digger.dig('https://github.com/cyrianax/easydig/', {
    selector: '#readme'    // css选择器，字符串格式，用于指定页面中要采集的范围，不填则处理整个网页
})
.then(result => {
    console.log(result)
    // =>
    // {
    //     * 内容标题，如果有<title>标签的话
    //     title: String,
    //
    //     * 关键词
    //     keywords: [
    //         {word: String, weight: Number},
    //         ...
    //     ],
    //
    //     * html内容
    //     content: String,
    //
    //     * markdown内容
    //     md: String,
    // }
})
.catch(error => {
    console.error(error);
})
```

### convert(html, [options])
convert方法用于直接处理一个html片段。它接收一个html片段和可选的options设置，并返回一个结果集，其结构与dig方法的成功返回的result对象相同
```javascript
let content = digger.convert(`
    <div>
        <div class="content">
            ...
        </div>
        ...
    </div>
`, {
    selector: '.content'    // css选择器，字符串格式，用于指定页面中要采集的范围，不填则处理整个html片段
})
```
