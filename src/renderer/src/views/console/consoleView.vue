<template>
  <div class="console-container">
    <start-options />
    <terminal />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import startOptions from './components/startOptions.vue'
import terminal from './components/terminal.vue'
import { Player, usePlayerStore } from '@renderer/store/player'

const { initPlayer } = usePlayerStore()

onMounted(() => {
  window.api.MCUserInfo((_, MCUserInfo, whitelist) => {
    const newWhitelist = whitelist.map((it) => {
      return it.name
    })
    const playerInfo = MCUserInfo.map((userInfo): Player => {
      return {
        name: userInfo.name,
        status: false,
        whitelist: newWhitelist.includes(userInfo.name),
        category: '玩家',
        texturesInfo: userInfo.TexturesInfo
      }
    })
    initPlayer(playerInfo)
  })
})
</script>

<style lang="scss" scoped>
.console-container {
  height: 100%;
  .el-card {
    height: 100%;
  }
}
</style>
