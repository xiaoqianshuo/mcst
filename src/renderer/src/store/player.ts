import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface Player {
  name: string
  status: boolean
  whitelist: boolean
  category: '玩家' | 'carpet假人'
  texturesInfo: TexturesInfo
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

export const usePlayerStore = defineStore('player', () => {
  const player = ref<Player[]>([])

  // 所有玩家
  const allPlayer = computed(() => player.value)
  // 白名单
  const whitelist = computed(() => {
    return player.value.filter((it) => it.whitelist === true)
  })
  // 假人
  const dummy = computed(() => {
    return player.value.filter((it) => it.category === 'carpet假人')
  })

  /**
   * 初始化玩家列表
   * @param data 玩家信息数组
   */
  function initPlayer(data: Player[]) {
    player.value = data
  }
  /**
   * 根据 name 获取玩家
   * @param name 玩家名称
   * @returns 玩家信息
   */
  function getPlayer(name: string) {
    return player.value.filter((it) => it.name === name)[0]
  }

  /**
   * 添加玩家
   * @param data 玩家对象
   */
  function addPlayer(data: Player) {
    player.value.push(data)
  }

  /**
   * 加入游戏
   * @param name 玩家名称
   */
  function joinedGame(name: string) {
    const p = player.value.find((p) => p.name === name)
    if (p) {
      p.status = true
    } else {
      addPlayer({
        name,
        status: true,
        whitelist: false,
        category: '玩家',
        texturesInfo: {
          timestamp: 11111111n,
          profileId: 'string',
          profileName: 'string',
          textures: {
            SKIN: {
              url: 'string'
            },
            CAPE: {
              url: 'string'
            }
          }
        }
      })
    }
    console.log(player)
  }

  /**
   * 离开游戏
   * @param name 玩家名称
   */
  function leftGame(name: string) {
    const p = player.value.find((p) => p.name === name)
    if (p) {
      p.status = false
    }
  }

  /**
   * 删除玩家
   * @param name 玩家名
   */
  function deletePlayer(name: string) {
    player.value = player.value.filter((it) => it.name !== name)
  }

  return {
    allPlayer,
    whitelist,
    dummy,
    initPlayer,
    getPlayer,
    addPlayer,
    joinedGame,
    leftGame,
    deletePlayer
  }
})
