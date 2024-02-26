const { app, BrowserWindow } = require('electron/main');
const {registerProtocol, handleProtocol} = require('@/utils/util')

// registerProtocol();


app.whenReady().then(() => {

  // handleProtocol()
  
  const win = new BrowserWindow({
    webPreferences: {
      // preload: path.resolve(process.env.VIEW_ROOT, 'preload.cjs')
    }
  })

  if (process.env.curEnv === 'production') {
    win.loadURL('app://./index.html')
  } else {
    win.loadURL(`http://localhost:${process.env.DEV_PORT}`);
  }
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})