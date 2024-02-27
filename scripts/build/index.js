
const Builder = require('./builder');

/** 打包 */
async function build() {
  let builder = await new Builder()
    .clearOutput()
    .buildRender();
  
  try {
    await builder
    .buildMain()
    .buildModule()
    .buildIcon()
    .buildInstaller();
  } catch(e) {
    throw e
  } finally {
    builder.clearIcon()
  }
}


build();