
const Dev = require('./dev');

async function start() {
  const dev = new Dev();
  await dev.clearOutput().startDevServer();
  dev.buildMain()
    .startMain();
}

start();








