/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import Store from 'electron-store';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const store = new Store();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const fileExtension: string[] = ['json', 'txt', 'md', 'jpg', 'png'];

// IPC listener
// file open dialog
ipcMain.on('file-open', (event, arg) => {
  const [fileName] = arg;
  const ext = fileName.split('.').pop();

  if (fileName) {
    const folderPath = store.get('folderPath') as string;
    const filePath = path.join(folderPath, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    if (ext === 'jpg' || ext === 'png') {
      const image = fs.readFileSync(filePath, 'base64');
      event.reply('file-open-reply', image, fileName);
    } else {
      event.reply('file-open-reply', fileContent, fileName);
    }

    store.set('filePath', filePath);
    store.set('fileName', fileName);
  } else {
    const { dialog } = require('electron');
    dialog
      .showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: '', extensions: ['md', 'txt'] }],
      })
      .then((result) => {
        if (result.filePaths.length > 0) {
          const filePath = result.filePaths[0];
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          event.reply('file-open-reply', fileContent);
          store.set('folderPath', path.dirname(filePath));
          event.reply('folder-open-reply', []);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

// file create in active folder
ipcMain.on('file-new', (event, arg) => {
  const fileName = arg[0];
  const folderPath = store.get('folderPath') as string;
  const filePath = path.join(folderPath, fileName);

  fs.writeFile(filePath, '', (err) => {
    if (err) throw err;
  });
});

// file save
ipcMain.on('file-save', (event, arg) => {
  const filePath = store.get('filePath') as string;
  if (filePath) {
    fs.writeFileSync(filePath, arg[0]);
  } else {
    const { dialog } = require('electron');
    dialog
      .showSaveDialog({
        properties: ['createDirectory'],
        filters: [{ name: '', extensions: ['md', 'txt'] }],
      })
      .then((result) => {
        if (result.filePath) {
          fs.writeFileSync(result.filePath, arg[0]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

// delete file
ipcMain.on('file-delete', (event, arg) => {
  const [fileName] = arg;
  const folderPath = store.get('folderPath') as string;
  const filePath = path.join(folderPath, fileName);
  fs.unlinkSync(filePath);
});

// folder open
ipcMain.on('folder-open', (event, arg) => {
  const { dialog } = require('electron');
  dialog
    .showOpenDialog({
      properties: ['openDirectory'],
    })
    .then((result) => {
      if (result.filePaths.length > 0) {
        const folderPath = result.filePaths[0];
        const folderContent = fs.readdirSync(folderPath);
        const filteredFolderContent = folderContent.filter((file) => {
          const ext = path.extname(file);
          return fileExtension.includes(ext.slice(1));
        });
        store.set('folderPath', folderPath);
        event.reply('folder-open-reply', filteredFolderContent);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// folder refresh
ipcMain.on('folder-refresh', (event, arg) => {
  const folderPath = store.get('folderPath') as string;
  const folderContent = fs.readdirSync(folderPath);
  const filteredFolderContent = folderContent.filter((file) => {
    const ext = path.extname(file);
    return fileExtension.includes(ext.slice(1));
  });
  store.set('folderPath', folderPath);
  event.reply('folder-open-reply', filteredFolderContent);
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('logo.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
