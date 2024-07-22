import { ipcMain } from 'electron'
import { serverProcess } from './minecraftServer'

// 发送指令
ipcMain.on('send-command', (event, command: string) => {
  if (serverProcess) {
    serverProcess.stdin.write(`${command}\n`)
  } else {
    event.reply('server-output', '未检测到服务器进程！')
  }
})
