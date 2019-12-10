const os = require('os')
// 获取命令行变量
const configArgv = JSON.parse(process.env.npm_config_argv)
const original = configArgv.original.slice(1)
const stage = original[1] ? original[1].replace(/-/g, '') : ''
const apiurl = original[2] ? original[2].replace(/-/g, '') : ''

module.exports = {
  stage, apiurl
}
