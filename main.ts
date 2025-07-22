import { app, BrowserWindow, ipcMain, Tray, Menu, shell } from 'electron';
import path from 'path';
import fs from 'fs';

let mainWindow: BrowserWindow;
let tray: Tray;
const configPath = path.join(app.getPath('userData'), 'config.json');

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'yuri.png'),
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');
}

function createTray(): void {
  tray = new Tray(path.join(__dirname, 'yuri.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Yuri Settings', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Exit', click: () => app.quit() },
  ]);
  tray.setToolTip('Yuri - URI Handler');
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  app.setAsDefaultProtocolClient('yuri');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.handle('load-config', async () => {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  return { protocols: [], profiles: [], selectedProfile: 'default' };
});

ipcMain.on('save-config', (_event, data) => {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf8');
});

ipcMain.on('test-uri', (_event, uri: string) => {
  shell.openExternal(uri);
});

ipcMain.handle('export-config', async () => {
  return fs.readFileSync(configPath, 'utf8');
});

ipcMain.handle('import-config', async (_event, text: string) => {
  fs.writeFileSync(configPath, text, 'utf8');
  return JSON.parse(text);
});

ipcMain.handle('backup-config', () => {
  const dest = path.join(app.getPath('desktop'), 'yuri-backup.json');
  fs.copyFileSync(configPath, dest);
});

ipcMain.handle('restore-config', () => {
  const backup = path.join(app.getPath('desktop'), 'yuri-backup.json');
  if (fs.existsSync(backup)) {
    const data = JSON.parse(fs.readFileSync(backup, 'utf8'));
    fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf8');
    return data;
  }
  return {};
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
