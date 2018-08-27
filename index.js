/**
 * 1. 先用apngdis把apng分解为png
 * 2. 用trim-image trim每个png, 然后记录所有的配置信息
 * 3. 计算所有配置信息中兼容最大尺寸的配置
 * 4. 用该配置重新trim所有的png
 * 5. 把trim后的pngs合成一个apng
 */

let trimAPNG = require('./src/trim-apng')
let delay = require('./src/delay')
module.exports = trimAPNG
module.exports.delay = delay