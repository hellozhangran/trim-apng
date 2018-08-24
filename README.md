# trim-apng

## 原理
先把apng文件解压成多个png文件，然后trim所有的png，得到容得下所有图片的尺寸配置数据，然后用这个配置数据再次trim png，最后把这些png打包成apng

*Disassemble apng to many pngs, then trim every pngs to get the max size config, re-trim pngs, finally assemble pngs to apng*

## 使用 Usage

```javascript

let trimAPNG = require('trim-apng');
trimAPNG(input, output, function(config){
    console.log(config)
})

```

## 参考
> * trim-image: https://github.com/renanvaz/trim-image
> * APNG那些事：https://aotu.io/notes/2016/11/07/apng/index.html
> * PNG文件格式详解：https://blog.mythsman.com/2015/12/08/1/

