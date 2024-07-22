<template>
  <canvas ref="skinCanvas" :width="armW * 2 + bodyW" :height="headH + bodyH + legH" />
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

// 身体宽高
const bodyW = ref(8 * props.size)
const bodyH = ref(12 * props.size)

// 手宽高
const armW = ref(4 * props.size)
const armH = ref(12 * props.size)

// 脚宽高
const legW = ref(4 * props.size)
const legH = ref(12 * props.size)

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
    ctx.drawImage(img, 8, 8, 8, 8, armW.value, 0, headW.value, headH.value) // 正面
    // ctx.drawImage(img, 8, 0, 8, 8, 56, 0, 8 * scale, 8 * scale) // 顶部
    // ctx.drawImage(img, 0, 8, 8, 8, 48, 32, 8 * scale, 8 * scale) // 侧面

    // 绘制身体
    ctx.drawImage(img, 20, 20, 8, 12, armW.value, headH.value, bodyW.value, bodyH.value) // 正面
    // ctx.drawImage(img, 32, 20, 8, 12, 88, 64, 8 * scale, 12 * scale) // 背面

    // 绘制左腿
    ctx.drawImage(img, 4, 20, 4, 12, armW.value, headH.value + bodyH.value, legW.value, legH.value) // 正面
    // 绘制右腿
    ctx.drawImage(
      img,
      4,
      20,
      4,
      12,
      armW.value + legW.value,
      headH.value + bodyH.value,
      legW.value,
      legH.value
    ) // 正面

    // 绘制左臂
    ctx.drawImage(img, 44, 20, 4, 12, 0, headH.value, armW.value, armH.value) // 正面
    // 绘制右臂
    ctx.drawImage(img, 44, 20, 4, 12, armW.value + bodyW.value, headH.value, armW.value, armH.value) // 正面
  }
}
</script>
