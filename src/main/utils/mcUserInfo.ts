import axios from 'axios'
import { IpcMainEvent } from 'electron'
import fs from 'fs/promises'
import path from 'path'

export interface MCUserInfo {
  id: string
  name: string
  properties: [
    {
      name: 'textures' | string
      value: string
    }
  ]
  profileActions: []
  TexturesInfo: TexturesInfo
}

export interface TexturesInfo {
  timestamp: bigint
  profileId: string
  profileName: string
  textures: {
    SKIN: {
      url: string
    }
    CAPE: {
      url: string
    }
  }
}

export interface WhiteList {
  uuit: string
  name: string
}

export const getMCUserList = async (serverPath: string) => {
  const playerdataPath = path.resolve(serverPath, 'world', 'playerdata')
  const files = await fs.readdir(playerdataPath)
  const userList: string[] = []

  const statsPromises = files.map(async (file) => {
    const fullPath = path.resolve(playerdataPath, file)
    const stats = await fs.stat(fullPath)
    if (!stats.isDirectory() && path.extname(file) === '.dat') {
      userList.push(path.basename(file, path.extname(file)))
    }
  })

  await Promise.all(statsPromises)
  return userList
}

/**
 * 通过 UUID 获取用户信息
 * @param uuid 玩家 uuid
 * @returns Promise<MCUserInfo | null>
 */
export const getMCUserInfo = async (uuid: string) => {
  try {
    const resp = await axios.get(
      `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`
    )
    const data = resp.data as MCUserInfo
    if (data) {
      data.TexturesInfo = decodeTextures(data.properties[0].value)
      return data
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}

/**
 * 响应MC服务器用户信息
 * @param event IpcMainEvent
 * @param workingDirectory 服务器工作路径
 */
export const sendMCUserInfo = async (event: IpcMainEvent, workingDirectory: string) => {
  const userList = await getMCUserList(workingDirectory)
  const userInfoPromise = userList.map(async (MCUUID) => {
    return await getMCUserInfo(MCUUID)
  })
  let userInfo = await Promise.all(userInfoPromise)
  userInfo = userInfo.filter((it) => it?.name)
  const whitelist = await getWhitelist(workingDirectory)
  event.reply('mc-user-info', userInfo, whitelist)
}

/**
 * 解码 Base64 编码的 textures 属性
 * @param value textures 属性中 name: textures 对象中的 value
 * @returns Promise<TexturesInfo>
 */
export const decodeTextures = (value: string): TexturesInfo => {
  const decoded = Buffer.from(value, 'base64').toString('utf-8')
  return JSON.parse(decoded)
}

/**
 * 获取白名单
 * @param workingDirectory 服务器工作目录
 * @returns Promise<WhiteList[]>
 */
export const getWhitelist = async (workingDirectory: string) => {
  const whitelistPath = path.resolve(workingDirectory, 'whitelist.json')
  const whitelistBuffer = await fs.readFile(whitelistPath)
  const whitelist: WhiteList[] = JSON.parse(whitelistBuffer.toString())
  return whitelist
}
