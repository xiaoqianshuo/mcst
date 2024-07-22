import { ElectronAPI } from '@electron-toolkit/preload'
import { IpcRenderer, IpcRendererEvent } from 'electron'
import { MCUserInfo, WhiteList } from '../main/utils/mcUserInfo'
import { ModsContent } from '../main/utils/mcMod'

interface api {
  platform: NodeJS.Platform
  openExternal: (url: string) => Promise<void>
  serverOutput: (listener: (event: IpcRendererEvent, output: string) => void) => IpcRenderer
  MCUserInfo: (
    listener: (event: IpcRendererEvent, MCUserInfo: MCUserInfo[], whitelist: WhiteList[]) => void
  ) => IpcRenderer
  MCModsList: () => Promise<ModsContent[] | null>
  startServer: (startFilePath: string, javaPath: string, minRam: number, maxRam: number) => void
  stopServer: () => void
  selectStartFilePath: () => Promise<string>
  selectJavaPath: () => Promise<string>
  searchJavaPaths: () => Promise<string[]>
  sendCommand: (command: string) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: api
  }
}
