
const path = require('path');
const envs = ['development', 'production', 'test'];
// 根据参数选择环境， 默认为development环境
const curEnv = process.env.CUR_ENV = envs.find(item => process.env.CUR_ENV === item) || envs[0];
require('dotenv').config({
  path: [path.resolve(__dirname, '.env'), path.resolve(__dirname, `.env.${curEnv}`)]
})


/** 页面根目录 */
process.env.VIEW_ROOT = path.resolve(process.cwd(), process.env.VIEW_ROOT)

module.exports = {}