const { protocol, net } = require('electron/main');
const {pathToFileURL} = require('url')

/** 注册协议 */
function registerProtocol() {
  protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { standard: true, supportFetchAPI: true, secure: true, corsEnabled: true, } }
  ])
}

/** 处理协议 */
function handleProtocol() {
  protocol.handle('app', (req) => {
    const { host, pathname } = new URL(req.url)
    const pathToServe = path.resolve(__dirname, pathname)
    return net.fetch(pathToFileURL(pathToServe))
  })
}

module.exports = {
  registerProtocol,
  handleProtocol,
}