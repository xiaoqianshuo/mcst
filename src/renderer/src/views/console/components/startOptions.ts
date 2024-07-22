import { JavaFilePath, JavaFilePathStore } from '@renderer/database/JavaFilePathStore'
import { StartFilePath, StartFilePathStore } from '@renderer/database/StartFilePathStore'
import { computed, reactive, ref } from 'vue'

// 0：未在运行；1：正在启动中；2：正在运行中；
export const isServerRunning = ref<number>(0)
export const startPaths = ref<StartFilePath[]>([])
export const javaPaths = ref<JavaFilePath[]>([])

export interface StartOptionsForm {
  startFile: string
  javaFile: string
  ram: number[]
}

export const startOptionsForm = reactive<StartOptionsForm>({
  startFile: '',
  javaFile: '',
  ram: [1024, 2048]
})

export const javaFilePathStore = ref(new JavaFilePathStore())
export const startFilePathStore = ref(new StartFilePathStore())

export const status = computed(() => {
  if (isServerRunning.value === 0) {
    return '--el-color-danger'
  } else if (isServerRunning.value === 1) {
    return '--el-color-warning'
  } else if (isServerRunning.value === 2) {
    return '--el-color-success'
  } else {
    return '--el-color-info'
  }
})

export const init = async () => {
  await javaFilePathStore.value.addJavaFilePath(await window.api.searchJavaPaths())
  javaPaths.value = await javaFilePathStore.value.getJavaFilePaths()
  startPaths.value = await startFilePathStore.value.getStartFilePaths()
}

/**
 * 选择启动文件路径
 */
export const selectStartFile = async () => {
  const startFile = await window.api.selectStartFilePath()
  if (startFile && !startPaths.value.find((it) => it.path === startFile)) {
    startFilePathStore.value.addStartFilePath(startFile)
    startPaths.value.push({ path: startFile })
    startOptionsForm.startFile = startFile
  }
}

/**
 * 选择java文件路径
 */
export const selectJavaPath = async () => {
  const javaFile = await window.api.selectJavaPath()
  if (javaFile && !javaPaths.value.find((it) => it.path === javaFile)) {
    javaFilePathStore.value.addJavaFilePath(javaFile)
    javaPaths.value.push({ path: javaFile })
    startOptionsForm.javaFile = javaFile
  }
}

/**
 * 开服
 */
export const startServer = () => {
  if (startOptionsForm.startFile) {
    isServerRunning.value = 1
    window.api.startServer(
      startOptionsForm.startFile,
      startOptionsForm.javaFile,
      startOptionsForm.ram[0],
      startOptionsForm.ram[1]
    )
  }
}

/**
 * 关服
 */
export const stopServer = () => {
  isServerRunning.value = 1
  window.api.stopServer()
}
