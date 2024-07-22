<template>
  <el-table :data="tableData" height="100%" @row-click="handleInfo">
    <el-table-column label="图标" width="100">
      <template #default="scope">
        <el-image style="width: 70px; height: 70px" :src="scope.row.icon" fit="cover">
          <template #error>
            <div>
              <el-icon><icon-picture /></el-icon>
            </div>
          </template>
        </el-image>
      </template>
    </el-table-column>
    <el-table-column label="名称" prop="name" width="140" />
    <el-table-column label="描述信息" prop="description" />
    <el-table-column label="作者" prop="author" width="140" />
    <el-table-column label="操作" align="center" width="90">
      <template #default="scope">
        <el-button size="small" @click="handleInfo(scope.row)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Picture as IconPicture } from '@element-plus/icons-vue'

interface ModsContent {
  name: string
  author: string
  contact: contact
  description: string
  icon: string
}

interface contact {
  homepage?: string
  sources?: string
  issues?: string
}

const handleInfo = (row: ModsContent) => {
  if (row.contact.homepage) {
    window.api.openExternal(row.contact.homepage)
  } else if (row.contact.sources) {
    window.api.openExternal(row.contact.sources)
  } else if (row.contact.issues) {
    window.api.openExternal(row.contact.issues)
  } else {
    alert('没有地址')
  }
}

const tableData = ref<ModsContent[]>()

onMounted(async () => {
  const modsContent = await window.api.MCModsList()
  if (modsContent) {
    tableData.value = modsContent
  } else {
    console.log('服务器未启动')
  }
})
</script>

<style lang="scss" scoped>
:deep(.el-tabs__content) {
  height: 100%;
}
</style>
