
const path = require('path');
const envs = ['development', 'production', 'test'];
const packageJson = require(path.resolve(process.cwd(), 'package.json'))


module.exports = function loadEnv(env) { 
  const envStr = loadDotEnv(env);
  const envStr2 = loadDynamicEnv(env);

  return `${envStr};${envStr2};`;
}


/** 加载文件(.env, .env.[development])中的环境变量 */
function loadDotEnv(env) {
 // 根据参数选择环境， 默认为development环境
 const curEnv = process.env.CUR_ENV = envs.find(item => env === item) || envs[0];
 const dotEnvs = require('dotenv').config({
   path: [path.resolve(process.cwd(), '.env'), path.resolve(process.cwd(), `.env.${curEnv}`)]
 })
  
 return Object.entries(dotEnvs.parsed).map(item => `process['env']['${item[0]}']='${item[1]}'`).join(';')
}


/** 设置额外的环境变量 */
function loadDynamicEnv(curEnv) {
  const env = {
    // 页面根目录
    VIEW_ROOT: path.resolve(process.cwd(), process.env.VIEW_ROOT),
    APP_VERSION: packageJson.version,
    RES_DIR: curEnv === 'production' ? process.resourcesPath : path.join(process.cwd(), "resource/release")
  }

  for (const key in env) {
    process.env[key] = env[key]
  }

  return Object.entries(env).map(item => `process['env']['${item[0]}']='${item[1]}'`).join(';')
}

