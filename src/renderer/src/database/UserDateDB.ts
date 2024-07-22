import IndexedDBManager from './IndexedDBManager'

const storeList = ['javaFilePath', 'startFilePath'] as const

type storeName = (typeof storeList)[number]

class UserDataDB<T> extends IndexedDBManager<T> {
  constructor(storeName: storeName) {
    super('userData', storeList, storeName, 1)
  }
}

export default UserDataDB
