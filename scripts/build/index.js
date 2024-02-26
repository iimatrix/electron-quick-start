
const Builder = require('./builder');

/** 打包 */
async function build() {
  let builder = await new Builder()
    .clearOutput()
    .buildRender();
  
  await builder
    .buildMain()
    .buildModule()
    .buildIcon()
    .buildInstaller();
  
    builder.clearIcon()
}


build();