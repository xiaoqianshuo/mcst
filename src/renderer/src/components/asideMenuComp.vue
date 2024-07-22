<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    text-color="#fff"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    router
    default-active="1"
  >
    <el-menu-item :route="{ path: '/' }" index="1">
      <el-icon><icon-menu /></el-icon>
      <template #title>控制台</template>
    </el-menu-item>
    <el-menu-item :route="{ path: '/player' }" index="4">
      <el-icon><help-filled /></el-icon>
      <template #title>玩家管理</template>
    </el-menu-item>
    <el-menu-item :route="{ path: '/mods' }" index="2">
      <el-icon><set-up /></el-icon>
      <template #title>模组管理</template>
    </el-menu-item>
    <el-menu-item :route="{ path: '/command' }" index="3">
      <el-icon><d-arrow-right /></el-icon>
      <template #title>快速命令</template>
    </el-menu-item>
    <el-menu-item :route="{ path: '/setting' }" index="5">
      <el-icon><setting /></el-icon>
      <template #title>设置</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { Menu as IconMenu, DArrowRight, Setting, SetUp, HelpFilled } from '@element-plus/icons-vue'
import { useDebounceFn } from '@vueuse/core'
import { ref } from 'vue'

const isCollapse = ref(false)

const debounceFn = useDebounceFn(() => {
  if (window.innerWidth < 800) {
    isCollapse.value = true
  } else {
    isCollapse.value = false
  }
}, 300)

window.addEventListener('resize', debounceFn)
</script>

<style>
.el-menu-vertical-demo {
  height: 100%;

  &:not(.el-menu--collapse) {
    width: 200px;
  }
}
</style>
