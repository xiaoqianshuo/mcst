<template>
  <el-container class="app-container">
    <!-- <el-header height="40px">
      <titlebar />
    </el-header> -->
    <el-container style="height: calc(100vh)">
      <el-aside width="auto">
        <asideMenuComp />
      </el-aside>
      <el-main style="height: 100%; overflow: hidden">
        <router-view v-slot="{ Component }">
          <keep-alive include="consoleView">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
// import titlebar from '@renderer/components/titlebarComp.vue'
import asideMenuComp from '@renderer/components/asideMenuComp.vue'
</script>

<style lang="scss" scoped>
.app-container {
  height: 100vh;

  .el-header {
    padding: 0;
  }
}
</style>
