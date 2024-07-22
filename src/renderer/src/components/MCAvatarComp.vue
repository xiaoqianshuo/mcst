<template>
  <canvas ref="skinCanvas" :width="headW" :height="headH" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  skinUrl: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 4
  }
})

// 头部宽高
const headH = ref(8 * props.size)
const headW = ref(8 * props.size)

const skinCanvas = ref<HTMLCanvasElement>()

onMounted(() => {
  renderSkin()
})

/**
 * 渲染图片
 */
const renderSkin = () => {
  const canvas = skinCanvas.value
  if (!canvas) {
    return
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  // 解决图像模糊
  ctx.imageSmoothingEnabled = false

  const img = new Image()
  img.crossOrigin = 'anonymous' // 允许跨域请求
  img.src = props.skinUrl

  img.onload = () => {
    // 绘制头部
    ctx.drawImage(img, 8, 8, 8, 8, 0, 0, headW.value, headH.value) // 正面
  }
}
</script>
