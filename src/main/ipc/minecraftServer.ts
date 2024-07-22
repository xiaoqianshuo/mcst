import { ipcMain } from 'electron'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import path from 'path'
import os from 'os'
import { sendMCUserInfo } from '../utils/mcUserInfo'
import { getModsList } from '../utils/mcMod'

// 用于保存服务器进程
export let serverProcess: ChildProcessWithoutNullStreams | null = null

export let directory: string = ''

// 启动服务器
ipcMain.on('start-server', (event, startFilePath, javaPath, minRam, maxRam) => {
  if (serverProcess) {
    event.reply('server-output', '服务器已在运行。')
    return
  }

  const workingDirectory = path.dirname(startFilePath)
  const javaCommand = `${javaPath} -Xms${minRam}M -Xmx${maxRam}M -jar ${path.basename(startFilePath)} nogui`

  // 确定使用的 shell
  const shell = os.platform() === 'win32' ? 'powershell.exe' : 'sh'
  const shellCommand =
    os.platform() === 'win32'
      ? `chcp 65001; Set-Location -Path "${workingDirectory}"; ${javaCommand}`
      : `cd "${workingDirectory}" && ${javaCommand}`

  serverProcess = spawn(
    shell,
    os.platform() === 'win32' ? ['-Command', shellCommand] : ['-c', shellCommand],
    {
      cwd: workingDirectory,
      shell: true
    }
  )

  serverProcess.stdout.on('data', (data) => {
    if (data.toString().includes('s)! For help, type "help"')) {
      directory = workingDirectory
      sendMCUserInfo(event, workingDirectory)
    }
    event.reply('server-output', data.toString())
  })

  serverProcess.stderr.on('data', (data) => {
    event.reply('server-output', `ERROR: ${data.toString()}`)
  })

  serverProcess.on('close', (code) => {
    event.reply('server-output', `服务器以代码 ${code} 退出`)
    serverProcess = null
  })
})

// 关闭服务器
ipcMain.on('stop-server', (event) => {
  if (serverProcess) {
    clearServerProcess(event)
  } else {
    event.reply('server-output', '服务器未运行。')
  }
})

/**
 * 监听mods列表获取
 */
ipcMain.handle('mc-mods-list', async () => {
  if (directory) {
    return await getModsList(directory)
  } else {
    return null
  }
})

// 结束服务器进程
export function clearServerProcess(event?: Electron.IpcMainEvent | undefined) {
  if (serverProcess) {
    serverProcess.stdin.write('stop\n')
    serverProcess.on('close', () => {
      serverProcess = null
    })
  } else if (event) {
    event.reply('server-output', '没有服务器进程需要终止。')
  }
}
