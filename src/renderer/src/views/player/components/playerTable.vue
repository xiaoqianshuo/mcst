<template>
  <el-table :data="playerData" border style="width: 100%" height="100%">
    <el-table-column label="玩家名称">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.name }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="玩家分类" align="center" width="120">
      <template #default="scope">
        <el-tag>{{ scope.row.category }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="在线状态" align="center" width="100">
      <template #default="scope">
        <div style="display: flex; justify-content: center; align-items: center">
          <div
            class="player-status"
            :style="`background-color: var(${scope.row.status ? '--el-color-success' : '--el-color-danger'})`"
          ></div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="120">
      <template #default="scope">
        <el-button size="small" @click="playerInfo(scope.row)">查看信息</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { usePlayerStore } from '@renderer/store'
import type { Player } from '@renderer/store/player'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  userType: '所有玩家' | '白名单' | 'carpet假人'
}>()

const router = useRouter()

const { allPlayer, whitelist, dummy } = usePlayerStore()

const playerData = computed(() => {
  if (props.userType === '所有玩家') {
    return allPlayer
  } else if (props.userType === '白名单') {
    return whitelist
  } else if (props.userType === 'carpet假人') {
    return dummy
  } else {
    return []
  }
})

const playerInfo = (row: Player) => {
  router.push({ name: 'PlayerInfo', params: { name: row.name } })
}
</script>

<style lang="scss" scoped>
.player-status {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin: 0 14px 0 10px;
}
</style>
