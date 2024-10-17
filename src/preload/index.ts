import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

interface FilesInterface {
  fileName: string,
  fileContent: string
}

contextBridge.exposeInMainWorld('electron', {
  /**
   * Returns the system's current language
   */
  getLanguage: () => ipcRenderer.invoke('get-language'),
  /**
   * Gets paths history from pathsFile
   */
  getUsedPaths: () => ipcRenderer.invoke('get-used-paths'),
  /**
   * Inserts a new path in the pathsFile
   */
  savePath: (path: string) => ipcRenderer.invoke('save-path', path),
  /**
   * Extracts the data from the pdf files and generates the XML file in a given path
   */
  processData: (path: string, password: string, files: Array<FilesInterface>) => ipcRenderer
    .invoke('process-data', path, password, files),
  /**
   * Opens a dialog to select a directory
   */
  openDirDialog: () => ipcRenderer.invoke('dialog:openDir'),
  /**
   * Reveals a given path in fileExplorer
   */
  revealInExplorer: (path: string) => ipcRenderer.invoke('dialog:reveal', path),
  /**
   * Opens a dialog to select one or more files
   */
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
