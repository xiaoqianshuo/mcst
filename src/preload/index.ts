import { contextBridge, ipcRenderer, IpcRendererEvent, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { MCUserInfo, WhiteList } from '../main/utils/mcUserInfo'

// 渲染器的自定义 API
const api = {
  platform: process.platform,
  openExternal: (url: string) => shell.openExternal(url),
  serverOutput: (listener: (event: IpcRendererEvent, output: string) => void) =>
    ipcRenderer.on('server-output', listener),
  MCUserInfo: (
    listener: (event: IpcRendererEvent, MCUserInfo: MCUserInfo[], whitelist: WhiteList[]) => void
  ) => ipcRenderer.on('mc-user-info', listener),
  MCModsList: () => ipcRenderer.invoke('mc-mods-list'),
  startServer: (startFilePath: string, javaPath: string, minRam: number, maxRam: number) =>
    ipcRenderer.send('start-server', startFilePath, javaPath, minRam, maxRam),
  stopServer: () => ipcRenderer.send('stop-server'),
  selectStartFilePath: () => ipcRenderer.invoke('select-start-file-path'),
  selectJavaPath: () => ipcRenderer.invoke('select-java-path'),
  searchJavaPaths: () => ipcRenderer.invoke('search-java-paths'),
  sendCommand: (command: string) => ipcRenderer.send('send-command', command)
}

// 如果启用了上下文隔离，使用 `contextBridge` API 将 Electron API 暴露给渲染器，
// 否则直接添加到全局 DOM 中。
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore（在 dts 中定义）
  window.electron = electronAPI
  // @ts-ignore（在 dts 中定义）
  window.api = api
}
