import { app, shell, BrowserWindow, ipcMain, dialog, Menu, IpcMainInvokeEvent } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';

enum Language {
  EN = 'en',
  PT = 'pt',
  ES = 'es',
  ZH = 'zh',
  JA = 'ja',
  FR = 'fr',
  DE = 'de',
  RU = 'ru',
  HI = 'hi'
};

let mainWindow: BrowserWindow | null = null;
let currentLanguage: Language = Language.PT;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      defaultEncoding: 'UTF-8'
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  createLanguageMenu();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

function setLanguage(language: Language): void {
  currentLanguage = language;

  if (mainWindow) {
    mainWindow.webContents.send('language-changed', language);
    createLanguageMenu();
    mainWindow.reload();
  }
}

function createLanguageMenu(): void {
  const languageLabels = {
    [Language.EN]: "Language",
    [Language.PT]: "Idioma",
    [Language.ES]: "Idioma",
    [Language.ZH]: "语言",
    [Language.JA]: "言語",
    [Language.FR]: "Langue",
    [Language.DE]: "Sprache",
    [Language.RU]: "Язык",
    [Language.HI]: "भाषा"
  };

  const languageMenu = Menu.buildFromTemplate([
    {
      label: languageLabels[currentLanguage],
      submenu: [
        {
          label: 'English',
          type: 'radio',
          checked: currentLanguage === Language.EN,
          click: () => setLanguage(Language.EN)
        },
        {
          label: 'Português',
          type: 'radio',
          checked: currentLanguage === Language.PT,
          click: () => setLanguage(Language.PT)
        },
        {
          label: 'Español',
          type: 'radio',
          checked: currentLanguage === Language.ES,
          click: () => setLanguage(Language.ES)
        },
        {
          label: '中文',
          type: 'radio',
          checked: currentLanguage === Language.ZH,
          click: () => setLanguage(Language.ZH)
        },
        {
          label: '日本語',
          type: 'radio',
          checked: currentLanguage === Language.JA,
          click: () => setLanguage(Language.JA)
        },
        {
          label: 'Français',
          type: 'radio',
          checked: currentLanguage === Language.FR,
          click: () => setLanguage(Language.FR)
        },
        {
          label: 'Deutsch',
          type: 'radio',
          checked: currentLanguage === Language.DE,
          click: () => setLanguage(Language.DE)
        },
        {
          label: 'Русский',
          type: 'radio',
          checked: currentLanguage === Language.RU,
          click: () => setLanguage(Language.RU)
        },
        {
          label: 'हिन्दी',
          type: 'radio',
          checked: currentLanguage === Language.HI,
          click: () => setLanguage(Language.HI)
        },
      ]
    }
  ]);

  Menu.setApplicationMenu(languageMenu);
}

ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
  
  return canceled ? null : filePaths.filter(file => file.split(".")?.pop() == "pdf").map(path => {
    const fileName = path.split("\\")?.pop() ?? path;
    const fileContent = readFileSync(path);

    return { fileName, fileContent: fileContent.toString('base64') };
  });
});

ipcMain.handle('dialog:openDir', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return canceled ? null : filePaths;
});

ipcMain.handle('dialog:openPath', async (event: IpcMainInvokeEvent, path: string) => {
  const result = await shell.openPath(path);
  event.preventDefault();

  if (result) {
    console.error('Erro ao abrir o diretório:', result);
  }
});

ipcMain.handle('process-data', async (
  event: IpcMainInvokeEvent,
  path: string, // TODO: Salvar o arquivo XML no caminho correto
  password: string,
  files: Array<{ fileName: string, fileContent: string }>
) => {
  const pdfjsLib = await import('pdfjs-dist');
  const { getDocument } = pdfjsLib;

  const buffers = files.map(file => Buffer.from(file.fileContent, 'base64'));
  const uint8Arrays = buffers.map(buffer => new Uint8Array(buffer));
  const tasks = await Promise.all(uint8Arrays.map(uint8Array => getDocument({ data: uint8Array, password })));

  tasks.forEach(async task => {
    const pdfDocument = await task.promise;
    let fullText = '';

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();

      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    // TODO: Implementar a geração dos XMLs
    console.log(fullText);
  });

  event.preventDefault();
});

ipcMain.handle('get-language', () => currentLanguage);

/**
 * Arquivo que armazena os path utilizados
 */
const pathsFile: string = join(app.getPath('userData'), 'used-paths.txt');

ipcMain.handle('save-path', (event: IpcMainInvokeEvent, path: string) => {
  event.preventDefault();
  const buffer = Buffer.from(path, 'utf-8');

  if (existsSync(pathsFile)) {
    appendFileSync(pathsFile, [buffer, ";"].join(";"));

    const curdata = readFileSync(pathsFile);
    if (curdata.toString().split(';').some(k => k == path))
      return;
  } else
    writeFileSync(pathsFile, buffer);
});

ipcMain.handle('get-used-paths', () => {
  if (existsSync(pathsFile)) {
    const data = readFileSync(pathsFile);
    return data.toString().split(';');
  }
  
  return [];
});
