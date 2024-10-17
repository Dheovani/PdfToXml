import { ElectronAPI } from '@electron-toolkit/preload'
import { Language } from '@renderer/components/Translator'

declare global {
  interface Window {
    api: unknown,
    electron: ElectronAPI & {
      getLanguage: () => Promise<Language>,
      getUsedPaths: () => Promise<string>,
      savePath: (path: string) => Promise<void>,
      processData: (path: string, password: string, files: Array<{ fileName: string, fileContent: string }>) => Promise<void>,
      openDirDialog: () => Promise<string[] | undefined>,
      openPathDialog: (path: string) => Promise<void>,
      openFileDialog: () => Promise<File[] | undefined>
    }
  }
}
