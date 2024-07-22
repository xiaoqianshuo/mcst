import UserDataDB from './UserDateDB'

interface JavaFilePath {
  id?: number // 数据库自动生成
  path: string // java 文件路径
}

class JavaFilePathStore {
  private store: UserDataDB<JavaFilePath>

  constructor() {
    this.store = new UserDataDB<JavaFilePath>('javaFilePath')
  }

  /**
   * 获取 java 文件路径数组
   * @returns java 文件路径对象数组
   */
  async getJavaFilePaths() {
    await this.store.openDB()
    return await this.store.getAllItems()
  }

  /**
   * 添加 java 文件路径
   * @param path java 文件路径
   * @returns Promise<void>
   */
  async addJavaFilePath(path: string): Promise<void>
  /**
   * 添加 java 文件路径数组
   * @param paths java 文件路径数组
   * @returns Promise<void>
   */
  async addJavaFilePath(paths: string[]): Promise<void>
  /**
   * 添加 java 文件路径，支持单个路径和路径数组
   * @param pathOrPaths - java 文件路径或路径数组
   * @returns Promise<void>
   */
  async addJavaFilePath(pathOrPaths: string | string[]): Promise<void> {
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
   * 删除 java 文件路径
   * @param path java 文件路径
   */
  async deleteJavaFilePath(id: number) {
    await this.store.openDB()
    await this.store.deleteItem(id)
  }
}

export { JavaFilePathStore }
export type { JavaFilePath }
