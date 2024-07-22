import { shell, BrowserWindow, ipcMain, app } from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.ico?asset'
import { clearServerProcess, serverProcess } from './ipc/minecraftServer'

export let mainWindow: Electron.BrowserWindow

export function createWindow(): void {
  // 创建浏览器窗口。
  mainWindow = new BrowserWindow({
    minWidth: 650,
    width: 1000,
    minHeight: 650,
    height: 670,
    show: false,
    // ...(process.platform === 'linux' ? { icon } : { icon }),
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.setMenu(null)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 基于 electron-vite CLI 的渲染器热重载（HMR）。
  // 在开发环境加载远程 URL，或在生产环境加载本地 HTML 文件。
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('closed', () => {
    // 窗口关闭时，关闭服务器进程
    if (serverProcess) {
      serverProcess.kill('SIGINT') // 发送 SIGINT 信号结束进程
      clearServerProcess()
    }
  })
}

// 当 Electron 完成初始化并准备创建浏览器窗口时，将调用此方法。
// 某些 API 只能在此事件发生后使用。
app.whenReady().then(() => {
  // 为 Windows 设置应用程序用户模型 ID
  electronApp.setAppUserModelId('work.xiaoqianshuo.MCST')

  // 在开发环境中通过 F12 默认打开或关闭 DevTools
  // 在生产环境中忽略 CommandOrControl + R。
  // 详情见：https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // 在 macOS 上，当 dock 图标被点击且没有其他窗口打开时，通常会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 在所有窗口关闭时退出应用，macOS 除外。在 macOS 上，应用程序及其菜单栏通常会保持活动状态，直到用户使用 Cmd + Q 明确退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 最小化窗口
ipcMain.on('minimize-window', () => {
  mainWindow.minimize()
})

// 窗口大小切换
ipcMain.on('maximize-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
})

// 关闭窗口
ipcMain.on('close-window', () => {
  mainWindow.close()
})
