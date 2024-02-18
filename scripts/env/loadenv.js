
const path = require('path');
const envs = ['development', 'production', 'test'];
const packageJson = require(path.resolve(process.cwd(), 'package.json'))


loadEnv();
function loadEnv() { 
  loadDotEnv();
  loadDynamicEnv();
}





/** 加载文件(.env, .env.[development])中的环境变量 */
function loadDotEnv() {
 // 根据参数选择环境， 默认为development环境
 const curEnv = process.env.CUR_ENV = envs.find(item => process.env.CUR_ENV === item) || envs[0];
 require('dotenv').config({
   path: [path.resolve(__dirname, '.env'), path.resolve(__dirname, `.env.${curEnv}`)]
 })
}


/** 设置额外的环境变量 */
function loadDynamicEnv() {
  const env = {
    // 页面根目录
    VIEW_ROOT: path.resolve(process.cwd(), process.env.VIEW_ROOT),
    APP_VERSION: packageJson.version,
    RES_DIR: path.join(process.cwd(), "resource/release")
  }

  for (const key in env) {
    process.env[key] = env[key]
  }
}

