require('./env/loadenv');
const { defineConfig, createServer } = require('vite');
const { spawn } = require('child_process')
// const vue = require('@vitejs/plugin-vue');
const path = require('path');

async function start() {
  const options = defineConfig({
    root: process.env.VIEW_ROOT,
    // plugins: [vue()],
    server: {
    },
  })

  const server = await createServer(options)
  const devServer = await server.listen();
  // 开发服务的端口
  process.env.DEV_PORT = devServer.config.server.port;

  const executable = /^win/.test(process.platform) ? 'electron.cmd' : 'electron'
  const electronProcess = spawn(executable, [path.resolve(process.env.VIEW_ROOT, '../main/src/index.js')]);

  electronProcess.stdout.pipe(process.stdout)

  electronProcess.on('exit', () => {
    process.exit();
  })
}


start();