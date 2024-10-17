import { ElectronAPI } from '@electron-toolkit/preload'
import { Language } from '@renderer/components/Translator'

declare global {
  interface Window {
    api: unknown,
    electron: ElectronAPI & {
      /**
       * Returns the system's current language
       */
      getLanguage: () => Promise<Language>,
      /**
       * Gets paths history from pathsFile
       */
      getUsedPaths: () => Promise<string>,
      /**
       * Inserts a new path in the pathsFile
       */
      savePath: (path: string) => Promise<void>,
      /**
       * Extracts the data from the pdf files and generates the XML file in a given path
       */
      processData: (path: string, password: string, files: Array<{ fileName: string, fileContent: string }>) => Promise<void>,
      /**
       * Opens a dialog to select a directory
       */
      openDirDialog: () => Promise<string[] | undefined>,
      /**
       * Reveals a given path in fileExplorer
       */
      revealInExplorer: (path: string) => Promise<void>,
      /**
       * Opens a dialog to select one or more files
       */
      openFileDialog: () => Promise<File[] | undefined>
    }
  }
}
