const envStr = require('../env/loadenv')('production');
const path = require('path');
const esbuild = require('esbuild');
const os = require('os');
const fs = require('fs');
const vite = require('vite');
const {spawnSync} = require('child_process')
const rootPkgJson = require(path.join(process.cwd(), 'package.json'));

class Builder {
  entryFileName = 'index.js';
  bundlePath = path.join(process.cwd(), "release/bundled");
  appId = process.env.appId
  appName = process.env.appName || 'electron'


  clearOutput() {
    try {
      fs.rmdirSync(path.resolve(process.cwd(), 'release'), {recursive: true})
    } catch {

    }
    return this
  }

  /** 构建渲染进程代码 */
  async buildRender() {
    const options = vite.defineConfig({
      root: process.env.VIEW_ROOT,
      build: {
        minify: true,
        outDir: this.bundlePath,
        emptyOutDir: true,
        
      }
    })
  
    await vite.build(options)
    return this;
  };

  /** 构建主进程代码 */
  buildMain() {
    const entryFilePath = path.join(process.cwd(), 'packages/main/src/index.js')
    const outfile = path.join(this.bundlePath,  this.entryFileName);

    esbuild.buildSync({
      entryPoints: [entryFilePath],
      outfile,
      minify: true,
      bundle: true,
      platform: 'node',
      sourcemap: false,
      external: ['electron'],
      alias: {
        '@': path.resolve(process.cwd(), 'packages/main/src')
      }
    })

    const js = `${envStr}${os.EOL}${fs.readFileSync(outfile)}`;
    fs.writeFileSync(outfile, js);
    return this
  }

  buildIcon() {
    const iconPath = path.resolve(process.cwd(), process.env.iconPath)
    const executable = /^win/.test(process.platform) ? 'electron-icon-builder.cmd' : 'electron-icon-builder'

    try {
      fs.accessSync(iconPath)
      spawnSync(executable, ['-i', iconPath, '-o', '.']);
      const winIconPath = path.resolve(process.cwd(), 'icons/win/icon.ico')
      fs.accessSync(winIconPath);
      process.env.winIcon = winIconPath
      process.env.macIcon = path.resolve(process.cwd(), 'icons/mac/icon.icns')
    } catch {
      // 生成图标出错则清空图标文件夹
      this.clearIcon()
    }

    return this
  }

  clearIcon() {
    try {
      fs.rmdirSync(path.resolve(process.cwd(), 'icons'), {recursive: true})
    } catch {

    }
    return this
  }

  /** 打包模块依赖 */
  buildModule() {
    const pkgJsonpath = path.join(process.cwd(), "packages/main/package.json");
    const localPkgJson = JSON.parse(fs.readFileSync(pkgJsonpath, 'utf-8'));
    const electronConfig = rootPkgJson.devDependencies.electron.replace('^', '')

    delete localPkgJson.scripts;
    // 指定入口文件
    localPkgJson.main = this.entryFileName;
    localPkgJson.devDependencies = {
      electron: electronConfig
    };

    fs.writeFileSync(path.join(this.bundlePath, "package.json"), JSON.stringify(localPkgJson));
    // 依赖已被esbuild处理，为防止electron-builder重复安装依赖，新建一个空的node_modules目录
    fs.mkdirSync(path.join(this.bundlePath, 'node_modules'));

    return this
  }

  /** 制成安装程序 */
  async buildInstaller() {
    const options = {
      config: {
        directories: {
          output: path.join(this.bundlePath, '..'), // 打包输出目录
          app: this.bundlePath, // 应用目录
        },
        files: ['**/*'],
        extends: null,
        productName: this.appName, // 应用名称
        appId: this.appId, // 应用id
        asar: true,
        extraResources: require('../common/extraResources.js'), // 定义附加资源打包方式
        win: require('../common/winConfig.js'),
        mac: require('../common/macConfig.js'),
        nsis: require('../common/nsisConfig.js'),
        publish: [{ provider: 'generic', url: '' }],
        // project: path.resolve(process.cwd(), 'packages/main'),
      }
    }

    const builder = require('electron-builder');
    await builder.build(options)
    return this;
  }
}

module.exports = Builder;