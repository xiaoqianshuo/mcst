import UserDataDB from './UserDateDB'

interface StartFilePath {
  id?: number // 数据库自动生成
  path: string // 启动文件路径
}

class StartFilePathStore {
  private store: UserDataDB<StartFilePath>

  constructor() {
    this.store = new UserDataDB<StartFilePath>('startFilePath')
  }

  /**
   * 获取启动文件路径数组
   * @returns 启动文件路径对象数组
   */
  async getStartFilePaths() {
    await this.store.openDB()
    return await this.store.getAllItems()
  }

  /**
   * 添加启动文件路径
   * @param path 启动文件路径
   * @returns Promise<void>
   */
  async addStartFilePath(path: string): Promise<void>
  /**
   * 添加启动文件路劲数组
   * @param paths 启动文件路径数组
   * @returns Promise<void>
   */
  async addStartFilePath(paths: string[]): Promise<void>
  /**
   * 添加启动文件路径，支持单个路径和路径数组
   * @param pathOrPaths - 启动文件路径或路径数组
   * @returns Promise<void>
   */
  async addStartFilePath(pathOrPaths: string | string[]): Promise<void> {
    await this.store.openDB()
    if (typeof pathOrPaths === 'string') {
      await this.addSinglePath(pathOrPaths)
    } else {
      await Promise.all(pathOrPaths.map((path) => this.addSinglePath(path)))
    }
  }

  private async addSinglePath(path: string): Promise<void> {
    const pathObj = await this.store.getItem((it) => it.path === path)
    if (pathObj?.path === path) {
      return
    }
    await this.store.addItem({ path })
  }

  /**
   * 删除启动文件路径
   * @param path 启动文件路径
   */
  async deleteStartFilePath(id: number) {
    await this.store.openDB()
    await this.store.deleteItem(id)
  }
}

export { StartFilePathStore }
export type { StartFilePath }
