import AdmZip from 'adm-zip'
import path from 'path'
import fs from 'fs/promises'
import toml from 'toml'

export interface ModsContent {
  name: string
  author: string
  contact: contact
  description: string
  icon: string
}

interface contact {
  homepage: string
  sources?: string
  issues?: string
}

/**
 * 分析 mods 信息
 * @param modsPath mods路径
 * @returns ModsContent | null
 */
export function analyzedMods(modsPath: string): ModsContent | null {
  // 创建 AdmZip 实例
  const zip = new AdmZip(modsPath)
  // 获取 JAR 包中的 fabric.mod.json 文件
  const fabricModsEntry = zip.getEntry('fabric.mod.json')

  if (fabricModsEntry) {
    // 读取 fabric.mod.json 文件内容
    const modsContent = JSON.parse(fabricModsEntry.getData().toString('utf8'))
    const base64Icon =
      'data:image/png;base64,' + zip.getEntry(modsContent.icon)?.getData().toString('base64')
    return {
      name: modsContent.name,
      author: modsContent.authors[0],
      contact: modsContent.contact,
      description: modsContent.description,
      icon: base64Icon
    }
  } else {
    const modsTomlEntry = zip.getEntry('META-INF/mods.toml')
    if (modsTomlEntry) {
      const modsTomlContent = modsTomlEntry.getData().toString('utf8')
      const modsContent = JSON.parse(JSON.stringify(toml.parse(modsTomlContent)))
      const mods = modsContent.mods[0]
      const base64Icon =
        'data:image/png;base64,' + zip.getEntry(mods.logoFile)?.getData().toString('base64')
      return {
        name: mods.displayName,
        author: mods.authors,
        contact: {
          homepage: mods.displayURL
        },
        description: mods.description,
        icon: base64Icon
      }
    }
  }
  return null
}

/**
 * 获取mods列表内容
 * @param serverPath 服务器工作路径
 * @returns Promise<ModsContent[]> mods列表内容
 */
export async function getModsList(serverPath: string): Promise<ModsContent[]> {
  const modsPath = path.resolve(serverPath, 'mods')
  const files = await fs.readdir(modsPath)
  const modsList: ModsContent[] = []

  const modsPromises = files.map(async (file) => {
    const fullPath = path.resolve(modsPath, file)
    const stats = await fs.stat(fullPath)
    if (!stats.isDirectory() && path.extname(file) === '.jar') {
      const modsContent = analyzedMods(fullPath)
      modsContent && modsList.push(modsContent)
    }
  })

  await Promise.all(modsPromises)
  return modsList
}
