<template>
  <el-page-header @back="router.back()">
    <template #content>
      <div class="header-content">
        <MCAvatarComp :skin-url="userDetail.texturesInfo.textures.SKIN.url" :size="3" />
        <span style="margin: 0 8px">{{ userDetail.name }}</span>
        <el-tag size="small">{{ userDetail.category }}</el-tag>
      </div>
    </template>
    <template #extra>
      <div class="header-content">
        <el-button v-if="!userDetail.whitelist" type="success">加入白名单</el-button>
        <el-button v-else type="info">移出白名单</el-button>
        <el-button type="danger">永久删除用户数据</el-button>
      </div>
    </template>
  </el-page-header>
  <MCSkinComp :skin-url="userDetail.texturesInfo.textures.SKIN.url" />
  <div></div>
</template>
<script lang="ts" setup>
import MCSkinComp from '@renderer/components/MCSkinComp.vue'
import MCAvatarComp from '@renderer/components/MCAvatarComp.vue'
import { usePlayerStore } from '@renderer/store'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = usePlayerStore()

const userDetail = computed(() => {
  return store.getPlayer(route.params.name as string)
})
</script>
<style lang="scss" scoped>
.header-content {
  display: flex;
  align-items: center;
}
</style>
