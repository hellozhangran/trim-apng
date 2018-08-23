# trim-apng

## 原理
先把apng文件解压成多个png文件，然后trim所有的png， 得到最大公约数的配置数据，然后用这个配置再次trim png，最后把这些png打包成apng

`Disassemble apng to many pngs, then trim every pngs to get the max size config, re-trim pngs, finally assemble pngs to apng`

## 使用 Usage

```
let trimAPNG = require('trim-apng');
trimAPNG(input, output, function(config){


})
```

