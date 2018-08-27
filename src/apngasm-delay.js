/**
 * NOTICE: 该模块的使用需要本地安装apngasm命令行工具。 macos下安装：brew install apngasm
 */

const fse = require('fs-extra');
const path = require('path');
const execSync = require('child_process').execSync;

/**
 * @files 图片文件路径组成的数据
 * @outputFile 生成的图片
 * @delayOpts 配置delay, {firstDelay: 200, default: 200}
 */
function asm(paths, outputFile, delayOpts){

    if(!paths || paths.length == 0 || !outputFile || !delayOpts) {
        throw Error('parameters illegal')
    }

    let firstDelay = delayOpts.firstDelay,
        defaultDelay = delayOpts.default;

    // 生产参数字符串
    // 如果outputFile已经存在了，先清理一下
    if(fse.existsSync(outputFile)) {
        fse.unlinkSync(outputFile)
    }

    // apngasm -o e.png apngframe1.png 2000 apngframe2.png 200
    let cmd = 'apngasm -o ' + outputFile;
    let cs = []
    paths.forEach((path,index) => {
        if(index == 0) {
            cs.push(path + ' ' + firstDelay)
        }else {
            cs.push(path + ' ' + defaultDelay)
        }
    })
    cmd = cmd + ' ' + cs.join(' ')
    execSync(cmd)
}

module.exports = asm