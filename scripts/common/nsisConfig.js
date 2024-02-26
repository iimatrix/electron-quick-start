if (process.platform === "darwin") module.exports = {};
else
  module.exports = {
    perMachine: true,
    allowElevation: true,
    allowToChangeInstallationDirectory: false,
    // include: path.join(process.cwd(), "scripts/common/installer.nsh"),
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: process.env.appName,
    oneClick: false,
    // installerIcon: "../resource/unrelease/icon.ico",
    // uninstallerIcon: "../resource/unrelease/icon.ico",
    // installerHeader: "../resource/unrelease/icon.ico",
    // installerHeaderIcon: "../resource/unrelease/icon.ico",
  };