const fse = require('fs-extra');
const path = require('path');
const execSync = require('child_process').execSync;
const glob = require('glob')

const pngsDir = path.resolve(__dirname, '../pngs');
const _tmp_name = '_temp_png.png';

/**
 * 解压apng为png
 */
function apngdis(apngfile) {
    if(!fse.existsSync(apngfile)) {
        throw Error('apng 不存在')
    }
    // 创建pngs空目录，如果已经存在，则清空
    fse.emptyDirSync(pngsDir)

    let apngNewFile = path.resolve(pngsDir, path.basename(apngfile))
    //apngdis命令不能指定输出目录，只能在inputfile当前目录输出，所以只能把文件移动过来
    fse.copyFileSync(apngfile, apngNewFile)
    let cmd = [
        path.resolve(__dirname, './bin/apngdis'),
        apngNewFile,
        _tmp_name
    ]
    execSync(cmd.join(' '))

    // 把多余的文件从pngs中删除
    fse.removeSync(apngNewFile)
    txts = glob(path.resolve(pngsDir, './*.txt'), {sync: true});
    let len = txts.length || 0
    for(let i = 0; i < len; i++){
        fse.unlinkSync(txts[i])
    }
}

module.exports = apngdis