const { app, BrowserWindow, Menu, ipcMain } = require('electron/main')
const path = require("path")

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreenable: true,
    fullscreen: true,
    webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        webviewTag: true,
        nodeIntegration: true,
        contextIsolation: false
    }
  })

  Menu.setApplicationMenu(null)
  win.loadFile(path.join(__dirname, "menu.html"))
}

ipcMain.on("toggle-fullscreen", () => {
    win.setFullScreen(!win.isFullScreen());
});

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})