const { defineConfig, createServer } = require('vite');
const { spawn } = require('child_process')
// const vue = require('@vitejs/plugin-vue');
const path = require('path');


process.env.VIEW_ROOT = path.resolve(process.cwd(), './packages/view')

const port = process.env.DEV_PORT = 9877;

async function start() {
  const options = defineConfig({
    root: process.env.VIEW_ROOT,
    // plugins: [vue()],
    server: {
      port,
    },
  })

  const server = await createServer(options)
  server.listen();

  const executable = process.platform.includes('win') ? 'electron.cmd' : 'electron'
  const electronProcess = spawn(executable, [path.resolve(process.env.VIEW_ROOT, '../main/src/index.js')]);

  electronProcess.stdout.pipe(process.stdout)

  electronProcess.on('exit', () => {
    process.exit();
  })
}


start();