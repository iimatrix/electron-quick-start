require('./env/loadenv')('development');
const { defineConfig, createServer } = require('vite');
const { spawn } = require('child_process')
// const vue = require('@vitejs/plugin-vue');
const path = require('path');

async function start() {
  await startDevServer();
  // startElectron();
  startElectronByNodemon()
}

start();



/** 启动开发服务 */
async function startDevServer() {
  const options = defineConfig({
    root: process.env.VIEW_ROOT,
    // plugins: [vue()],
    server: {
    },
    // 预定义变量
    define: {
      DESKTOP: true, // 标识桌面端
      iSDEV: true, // 标识开发环境
    }
  })

  const server = await createServer(options)
  const devServer = await server.listen();
  server.printUrls();
  // 开发服务的端口
  process.env.DEV_PORT = devServer.config.server.port;
}

/** 启动electron */
function startElectron() {
  const executable = /^win/.test(process.platform) ? 'electron.cmd' : 'electron'
  const electronProcess = spawn(executable, [path.resolve(process.env.VIEW_ROOT, '../main/src/index.js')]);
  electronProcess.stdout.pipe(process.stdout)

  electronProcess.on('exit', () => {
    process.exit();
  })
}

function startElectronByNodemon() {
  const node = require('nodemon')({
    exec: `electron ${path.resolve(process.env.VIEW_ROOT, '../main/src/index.js')}`
  })

  node.on('exit', () => {
    process.exit();
  })
}
