import { dialog, ipcMain } from 'electron'
import { mainWindow } from '../window'
import findJavaPaths from '../utils/findJavaPaths'
import os from 'os'
import path from 'path'

// 选择服务器 jar 文件地址
ipcMain.handle('select-start-file-path', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'JAR Files', extensions: ['jar'] }]
  })
  if (result.canceled) {
    return null
  } else {
    return result.filePaths[0]
  }
})

// 选择 java 文件地址
ipcMain.handle('select-java-path', async () => {
  const platform = os.platform()
  let filters: Electron.FileFilter[]

  switch (platform) {
    case 'win32': // Windows
      filters = [{ name: 'Java Executable', extensions: ['exe'] }]
      break
    case 'darwin': // macOS
      filters = [{ name: 'Java Executable', extensions: ['command', 'sh'] }]
      break
    case 'linux': // Linux
      filters = [{ name: 'Java Executable', extensions: ['bin', 'sh'] }]
      break
    default:
      throw new Error('Unsupported OS')
  }

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: filters
  })

  if (result.canceled) {
    return null
  } else {
    const javaPath = result.filePaths[0]

    // 检查文件名是否是有效的 Java 执行文件
    if (
      (platform === 'win32' && path.basename(javaPath).toLowerCase() === 'java.exe') ||
      ((platform === 'darwin' || platform === 'linux') &&
        path.basename(javaPath).toLowerCase().includes('java'))
    ) {
      return javaPath
    } else {
      await dialog.showMessageBox(mainWindow, {
        type: 'warning',
        title: '文件错误',
        message: '请选择java可执行文件'
      })
      return ''
    }
  }
})

// 搜索 java 文件地址
ipcMain.handle('search-java-paths', async () => {
  return await findJavaPaths()
})
