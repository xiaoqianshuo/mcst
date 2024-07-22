<template>
  <el-form
    ref="formRef"
    class="start-options-container"
    style="max-width: 600px; max-height: 270px"
    :model="startOptionsForm"
    :rules="rules"
    label-width="auto"
    :label-position="labelPosition"
    :size="formSize"
    status-icon
  >
    <el-form-item label="启动文件(jar)" prop="startFile">
      <el-select
        v-model="startOptionsForm.startFile"
        placeholder="请选择启动文件"
        no-data-text="暂无历史启动文件"
      >
        <el-option
          v-for="startFile in startPaths"
          :key="startFile.id"
          :label="startFile.path"
          :value="startFile.path"
        >
          <span style="float: left">{{ startFile.path }}</span>
        </el-option>
        <template #footer>
          <div style="display: flex; justify-content: end">
            <el-button text bg size="small" @click="selectStartFile">选择启动文件</el-button>
          </div>
        </template>
      </el-select>
    </el-form-item>
    <el-form-item :label="javaLabel" prop="javaFile">
      <el-select
        v-model="startOptionsForm.javaFile"
        placeholder="请选择 java"
        no-data-text="未检测到安装的Java，请手动选择"
      >
        <el-option
          v-for="javaFile in javaPaths"
          :key="javaFile.id"
          :label="javaFile.path"
          :value="javaFile.path"
        >
          <span style="float: left">{{ javaFile.path }}</span>
        </el-option>
        <template #footer>
          <div style="display: flex; justify-content: end">
            <el-button text bg size="small" @click="selectJavaPath">手动选择</el-button>
          </div>
        </template>
      </el-select>
    </el-form-item>
    <el-form-item label="jvm 内存调整" prop="ram">
      <div class="slider-ram-block">
        <div class="ram-num">
          最小内存值：
          <el-input
            v-model="startOptionsForm.ram[0]"
            style="width: 80px"
            size="small"
            placeholder="最小内存值"
          >
            <template #suffix>
              <span class="article-suffix">MB</span>
            </template>
          </el-input>
          ；最大内存值：
          <el-input
            v-model="startOptionsForm.ram[1]"
            style="width: 80px"
            size="small"
            placeholder="最大内存值"
          >
            <template #suffix>
              <span class="article-suffix">MB</span>
            </template>
          </el-input>
        </div>
        <el-slider v-model="startOptionsForm.ram" range :marks="marks" :min="0" :max="10240" />
      </div>
    </el-form-item>
    <el-form-item style="margin-top: 35px">
      <div class="server-status" :style="`background-color: var(${status})`"></div>
      <el-button type="success" plain @click="startServer">开服</el-button>
      <el-button type="danger" plain @click="stopServer">关服</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { ComponentSize, FormInstance, FormProps, FormRules } from 'element-plus'
import {
  init,
  javaPaths,
  selectJavaPath,
  selectStartFile,
  startOptionsForm,
  StartOptionsForm,
  startPaths,
  startServer,
  status,
  stopServer
} from './startOptions'

const formSize = ref<ComponentSize>('default')
const labelPosition = ref<FormProps['labelPosition']>('right')
const formRef = ref<FormInstance>()

const javaLabel = computed(() => {
  const platform = window.api.platform
  if (platform === 'win32') {
    return 'java文件(java.exe)'
  } else {
    return 'java文件'
  }
})

const marks = reactive({
  1024: '1GB',
  2048: '2GB',
  4096: '4GB',
  6144: '6GB',
  8192: '8GB',
  10240: '10GB'
})

const rules = reactive<FormRules<StartOptionsForm>>({
  startFile: [{ required: true, message: '请选择启动文件！', trigger: 'blur' }],
  javaFile: [{ required: true, message: '请选择 java 文件！', trigger: 'blur' }]
})

onMounted(async () => {
  await init()
})
</script>

<style lang="scss" scoped>
.slider-ram-block {
  width: 100%;
  display: flex;
  flex-direction: column;

  .ram-num {
    display: flex;
    align-items: center;
  }
}

.server-status {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin: 0 14px 0 10px;
}
</style>
