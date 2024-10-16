import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

interface FilesInterface {
  fileName: string,
  fileContent: string
}

contextBridge.exposeInMainWorld('electron', {
  getLanguage: () => ipcRenderer.invoke('get-language'),
  processData: (path: string, files: Array<FilesInterface>) => ipcRenderer.invoke('process-data', path, files),
  openDirDialog: () => ipcRenderer.invoke('dialog:openDir'),
  openPathDialog: (path: string) => ipcRenderer.invoke('dialog:openPath', path),
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile')
    .then((files: Array<FilesInterface>) => {
      if (files) {
        return files.map(file => {
          const blob = new Blob([Uint8Array.from(atob(file.fileContent), c => c.charCodeAt(0))]);
          return new File([blob], file.fileName);
        });
      }

      return null;
    })
});

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
