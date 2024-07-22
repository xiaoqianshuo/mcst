class IndexedDBManager<T> {
  private dbName: string // 数据库名称
  private storeList: readonly string[] // 对象存储列表
  private storeName: string // 对象存储名称
  private version: number // 数据库版本
  private db: IDBDatabase | null = null // 数据库实例

  constructor(dbName: string, storeList: readonly string[], storeName: string, version: number) {
    this.dbName = dbName // 初始化数据库名称
    this.storeList = storeList // 初始化对象存储列表
    this.storeName = storeName // 初始化对象存储名称
    this.version = version // 初始化数据库版本
  }

  /**
   * 打开数据库
   */
  async openDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version) // 打开数据库请求

      // 当需要升级数据库时调用
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result
        // 如果对象存储不存在，则创建一个
        this.storeList.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true })
          }
        })
      }

      // 数据库成功打开时调用
      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result // 保存数据库实例
        resolve() // 解析Promise
      }

      // 处理打开数据库错误
      request.onerror = (event: Event) => {
        reject(`Database error: ${(event.target as IDBOpenDBRequest).error}`)
      }
    })
  }

  /**
   * 添加新项目
   * @param item
   */
  async addItem(item: T): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Database is not open') // 数据库未打开
      }

      const transaction = this.db.transaction(this.storeName, 'readwrite') // 创建读写事务
      const objectStore = transaction.objectStore(this.storeName) // 获取对象存储
      const request = objectStore.add(item) // 添加项目请求

      request.onsuccess = (event: Event) => {
        resolve((event.target as IDBRequest).result as number) // 返回新项目的ID
      }

      request.onerror = (event: Event) => {
        reject(`Add item error: ${(event.target as IDBRequest).error}`)
      }
    })
  }

  /**
   * 根据ID获取项目
   * @param id 项目 id
   * @returns Promise<T | undefined>
   */
  async getItem(id: number): Promise<T | undefined>
  /**
   * 根据条件获取项目
   * @param condition 条件
   * @returns Promise<T | undefined>
   */
  async getItem(condition: (item: T) => boolean): Promise<T | undefined>
  /**
   * 根据不同的条件获取项目
   * @param identifier
   * @returns Promise<T | undefined>
   */
  async getItem(identifier: number | ((item: T) => boolean)): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Database is not open') // 数据库未打开
      }

      const transaction = this.db.transaction(this.storeName, 'readonly') // 创建只读事务
      const objectStore = transaction.objectStore(this.storeName) // 获取对象存储

      if (typeof identifier === 'number') {
        // 根据 ID 获取项目
        const request = objectStore.get(identifier) // 获取项目请求

        request.onsuccess = (event: Event) => {
          resolve((event.target as IDBRequest).result as T) // 返回获取到的项目
        }

        request.onerror = (event: Event) => {
          reject(`Get item error: ${(event.target as IDBRequest).error}`)
        }
      } else {
        // 根据条件获取项目
        const request = objectStore.openCursor() // 打开游标以遍历项目

        request.onsuccess = (event: Event) => {
          const cursor = (event.target as IDBRequest).result as IDBCursorWithValue
          if (cursor) {
            if (identifier(cursor.value)) {
              resolve(cursor.value) // 如果匹配条件，返回项目
            } else {
              cursor.continue() // 继续遍历
            }
          } else {
            resolve(undefined) // 未找到匹配项
          }
        }

        request.onerror = (event: Event) => {
          reject(`Get item error: ${(event.target as IDBRequest).error}`)
        }
      }
    })
  }

  /**
   * 更新项目
   * @param item
   */
  async updateItem(item: T): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Database is not open') // 数据库未打开
      }

      const transaction = this.db.transaction(this.storeName, 'readwrite') // 创建读写事务
      const objectStore = transaction.objectStore(this.storeName) // 获取对象存储
      const request = objectStore.put(item) // 更新项目请求

      request.onsuccess = () => {
        resolve() // 解析Promise
      }

      request.onerror = (event: Event) => {
        reject(`Update item error: ${(event.target as IDBRequest).error}`)
      }
    })
  }

  /**
   * 根据id删除项目
   * @param id
   */
  async deleteItem(id: number): Promise<void>
  /**
   * 根据条件删除项目
   * @param condition
   */
  async deleteItem(condition: (item: T) => boolean): Promise<void>
  async deleteItem(identifier: number | ((item: T) => boolean)): Promise<void> {
    if (!this.db) {
      throw new Error('Database is not open') // 数据库未打开
    }

    // 根据ID删除项目
    if (typeof identifier === 'number') {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(this.storeName, 'readwrite') // 创建读写事务
        const objectStore = transaction.objectStore(this.storeName) // 获取对象存储
        const request = objectStore.delete(identifier) // 删除请求

        request.onsuccess = () => {
          resolve() // 解析Promise
        }

        request.onerror = (event: Event) => {
          reject(`Delete item error: ${(event.target as IDBRequest).error}`)
        }
      })
    } else {
      // 根据条件删除项目
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(this.storeName, 'readwrite') // 创建读写事务
        const objectStore = transaction.objectStore(this.storeName) // 获取对象存储
        const request = objectStore.openCursor() // 打开游标

        request.onsuccess = (event: Event) => {
          const cursor = (event.target as IDBRequest).result as IDBCursorWithValue
          if (cursor) {
            // 如果当前游标指向的项目符合条件，则删除
            if (identifier(cursor.value)) {
              cursor.delete()
            }
            cursor.continue() // 继续游标
          } else {
            resolve() // 完成操作
          }
        }

        request.onerror = (event: Event) => {
          reject(`Delete item error: ${(event.target as IDBRequest).error}`)
        }
      })
    }
  }

  /**
   * 获取所有项目
   */
  async getAllItems(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Database is not open') // 数据库未打开
      }

      const transaction = this.db.transaction(this.storeName, 'readonly') // 创建只读事务
      const objectStore = transaction.objectStore(this.storeName) // 获取对象存储
      const request = objectStore.getAll() // 获取所有项目请求

      request.onsuccess = (event: Event) => {
        resolve((event.target as IDBRequest).result as T[]) // 返回所有项目
      }

      request.onerror = (event: Event) => {
        reject(`Get all items error: ${(event.target as IDBRequest).error}`)
      }
    })
  }
}

export default IndexedDBManager
