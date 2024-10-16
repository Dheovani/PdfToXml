import { ElectronAPI } from '@electron-toolkit/preload'
import { Language } from '@renderer/components/Translator'

declare global {
  interface Window {
    api: unknown,
    electron: ElectronAPI & {
      getLanguage: () => Promise<Language>,
      openDirDialog: () => Promise<string[] | undefined>,
      openPathDialog: (path: string) => Promise<void>,
      openFileDialog: () => Promise<File[] | undefined>
    }
  }
}
