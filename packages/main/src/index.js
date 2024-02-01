const {app, BrowserWindow} = require('electron/main');
const path = require('path');


app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: {
      // preload: path.resolve(process.env.VIEW_ROOT, 'preload.cjs')
    }
  })

  win.loadURL(`http://localhost:${process.env.DEV_PORT}`);
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})