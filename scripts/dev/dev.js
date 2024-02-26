const envStr = require('../env/loadenv')('development');
const { defineConfig, createServer } = require('vite');
const { spawn } = require('child_process')
const os = require('os');
const fs = require('fs');
// const vue = require('@vitejs/plugin-vue');
const esbuild = require('esbuild');
const path = require('path');

class Dev  {
  entryFileName = 'index.js';
  bundlePath = path.join(process.cwd(), "release/bundled");

  clearOutput() {
    try {
      fs.rmdirSync(path.resolve(process.cwd(), 'release'), {recursive: true})
    } catch {

    }
    return this
  }
  
  /** 启动开发服务 */
  async startDevServer() {
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
    return this
  }

  /** 使用子进程启动electron */
  startElectron() {
    const executable = /^win/.test(process.platform) ? 'electron.cmd' : 'electron'
    const electronProcess = spawn(executable, [path.resolve(process.env.VIEW_ROOT, '../main/src/index.js')]);
    electronProcess.stdout.pipe(process.stdout)

    electronProcess.on('exit', () => {
      process.exit();
    })
  }

  /** 使用nodemon启动electron */
  startElectronByNodemon() {
    const node = require('nodemon')({
      exec: `electron ${path.resolve(process.env.VIEW_ROOT, '../main/src/index.js')}`
    })
  
    node.on('exit', () => {
      process.exit();
    })
  }

  /** 打包主进程代码 */
  buildMain() {
    const entryFilePath = path.join(process.cwd(), 'packages/main/src/index.js')
    const outfile = this.outfile = path.join(this.bundlePath,  this.entryFileName);
  
    esbuild.buildSync({
      entryPoints: [entryFilePath],
      outfile,
      bundle: true,
      platform: 'node',
      sourcemap: true,
      external: ['electron'],
      alias: {
        '@': path.resolve(process.cwd(), 'packages/main/src')
      }
    })
  
    const js = `${envStr}${os.EOL}${fs.readFileSync(outfile)}`;
    fs.writeFileSync(outfile, js);
    return this
  }

  /**  */
  startMain() {
    const electronProcess = spawn(require('electron').toString(), [this.outfile]);
    electronProcess.stdout.pipe(process.stdout)
    electronProcess.stderr.pipe(process.stderr)

    electronProcess.on('exit', () => {
      process.exit();
    })
  }
}

module.exports = Dev;