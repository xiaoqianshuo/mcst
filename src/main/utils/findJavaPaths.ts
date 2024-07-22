import { exec } from 'child_process'
import os from 'os'

/**
 * 查找系统安装的 java 路径
 * @returns Promise<string | string[]>
 */
function findJavaPaths() {
  return new Promise<string | string[]>((resolve, reject) => {
    const platform = os.platform()

    if (platform === 'win32') {
      // Windows command to find all Java installations
      exec('where java', (err, stdout, stderr) => {
        if (err) {
          reject(stderr)
        } else {
          resolve(stdout.split('\r\n').filter((path) => path.length > 0))
        }
      })
    } else if (platform === 'linux' || platform === 'darwin') {
      // Linux/Mac command to find all Java installations
      exec('which -a java', (err, stdout, stderr) => {
        if (err) {
          reject(stderr)
        } else {
          resolve(stdout.split('\n').filter((path) => path.length > 0))
        }
      })
    } else {
      reject(`Unsupported platform: ${platform}`)
    }
  })
}

export default findJavaPaths
