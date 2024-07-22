<template>
  <el-tabs style="height: 100%" type="border-card">
    <el-tab-pane
      v-for="userType in userTypes"
      :key="userType"
      style="height: 100%"
      :label="userType"
    >
      <playerTable :user-type="userType" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import playerTable from './components/playerTable.vue'
const userTypes = ref<('所有玩家' | '白名单' | 'carpet假人')[]>([
  '所有玩家',
  '白名单',
  'carpet假人'
])
</script>

<style lang="scss" scoped>
:deep(.el-tabs__content) {
  height: calc(100% - 38px);
}
</style>
