const fs = require('fs');
const path = require('path');
const envPath = path.resolve(__dirname, '.env');

/**
 *  将VIEW_ROOT环境变量写入.env文件
 * */ 
try {
  // 覆盖 .env里的VIEW_ROOT
  const text = fs.readFileSync(envPath);
  const envObj = require('dotenv').parse(text);
  envObj.VIEW_ROOT = process.env.VIEW_ROOT;
  const envStr = Object.entries(envObj).map(entry => entry.join('=')).join('\n')
  fs.writeFileSync(envPath, envStr)
} catch {
  fs.writeFileSync(envPath, `VIEW_ROOT=${process.env.VIEW_ROOT}`)
}
