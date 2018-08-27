const fse = require('fs-extra');
const path = require('path');
const execSync = require('child_process').execSync;
const glob = require('glob')
const apngasmDelay = require('../src/apngasm-delay')


let files = glob(path.resolve(__dirname, './apng/*.png'), {sync: true})
console.log(files)
apngasmDelay(files, path.resolve(__dirname, './output.png'), {
    firstDelay: 2000,
    default: 200
})

