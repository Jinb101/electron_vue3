const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');

app.commandLine.appendSwitch('lang', 'zh-CN');
const isDev = process.env.IS_DEV === "true";
let mainWindow;
function createWindow() {
     mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
        icon: path.join(__dirname, '../src/assets/logo.svg'),
        frame: false,
        autoHideMenuBar: true,
    });

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:5173/'
            : `file://${path.join(__dirname, '../dist/index.html')}`
    );

    if (isDev) {
        const devToolsWindow = new BrowserWindow({
            width: 800,
            height: 600
        });
        mainWindow.webContents.setDevToolsWebContents(devToolsWindow.webContents);
        mainWindow.webContents.openDevTools({ mode: 'detach' });
        mainWindow.webContents.webSecurity = true;
    }
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

ipcMain.on('window-control', (event, action) => {
    switch (action) {
        case 'minimize':
            mainWindow.minimize();
            break;
        case 'maximize':
            mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
            break;
        case 'close':
            mainWindow.close();
            break;
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});