const fse = require('fs-extra');
const path = require('path');
const glob = require('glob')
const apngdis = require('./apngdis')
const trimImage = require('./trim-image')
const Assembler = require('apng-assembler');

const pngsDir = path.resolve(__dirname, '../pngs');
const trimDir = path.resolve(__dirname, '../trims');

let global_configs = []
let max_config = {}

function trim(from, to, config) {
    let cmd = [from, to]
    if(config) cmd.push(config)
    return new Promise((resolve, reject) => {
        trimImage(...cmd, function(err, res) {
            if(err) {
                reject()
                console.error(err)
            }
            resolve(res)
        })
    })
}

function maxConfig(configs) {
    if(!configs.length) return
    let basic = {
        top: 500,
        right: 0,
        bottom: 0,
        left: 500
    }

    configs.forEach(con => {
        Object.assign(basic, {
            top: con.top < basic.top ? con.top : basic.top,
            right: con.right > basic.right ? con.right : basic.right,
            bottom: con.bottom > basic.bottom ? con.bottom : basic.bottom,
            left: con.left < basic.left ? con.left : basic.left,
        })
    })

    return basic;
}


module.exports = function(input, output, cb) {
    if(!input || !output) {
        throw Error('参数错误 ~')
    }

    if(!fse.existsSync(input)){
        throw Error('input 路径不合法')
    }

    let inputFile = input,
        outputFile = output;

    // 先把apng图片分解为n张png
    apngdis(inputFile)

    let files = glob(path.resolve(pngsDir, './*.png'), {sync: true})
    fse.emptyDirSync(trimDir)
    let promises = []
    files.forEach(function(file) {
        let outfile = path.resolve(trimDir, path.basename(file))
        promises.push(trim(file, outfile))
    })

    Promise.all(promises).then(res => {
        global_configs = res
        promises = []
        max_config = maxConfig(global_configs)

        fse.emptyDirSync(trimDir)
        files.forEach(function(fil) {
            let outfile = path.resolve(trimDir, path.basename(fil))
            promises.push(trim(fil, outfile, max_config))
        })
        Promise.all(promises).then(resp => {
            fse.emptyDirSync(pngsDir)
            setTimeout(() => {
                Assembler.assemble(
                    path.resolve(trimDir, './_temp_png*.png'),
                    outputFile,
                    {
                        loopCount: 0,
                        frameDelay: 500,
                        compression: Assembler.COMPRESS_7ZIP
                    }
                ).then(
                    function(outputDir) {
                        fse.emptyDirSync(trimDir)
                        cb(max_config)
                    },
                    function(error) {
                        cb('error')
                        console.error(`Failed to assemble: ${error.message}`);
                        console.error(`stdout: ${error.stdout}`);
                        console.error(`stderr: ${error.stderr}`);
                    }
                );
            }, 100)
        })
    })
}