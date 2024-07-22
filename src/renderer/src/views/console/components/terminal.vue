<template>
  <div ref="terminal" class="terminal" @click="focusInput">
    <p v-for="(message, index) in messages" :key="index" class="allow-select">
      {{ message }}
    </p>
    <p class="input-box">
      <span>{{ `>` }}</span>
      <input
        ref="inputRef"
        v-model="input"
        type="text"
        class="input"
        @keydown.enter="handleCommand"
      />
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchPostEffect, onActivated } from 'vue'
import { isServerRunning } from './startOptions'
import { usePlayerStore } from '@renderer/store'

const messages = ref<string[]>(['Welcome to the Minecraft Server Tools!'])
const terminal = ref<HTMLElement | null>(null)
const input = ref<string>('')
const inputRef = ref<HTMLInputElement | null>(null)

const { joinedGame, leftGame } = usePlayerStore()

const scrollToBottom = () => {
  const terminalEl = terminal.value
  if (terminalEl) {
    terminalEl.scrollTop = terminalEl.scrollHeight
  }
}

const handleCommand = async () => {
  if (input.value.trim()) {
    messages.value.push(`> ${input.value}`)
    // 处理命令逻辑
    await window.api.sendCommand(input.value)
    input.value = ''
  }
}

const focusInput = (event: MouseEvent) => {
  if ((event.target as HTMLElement).tagName !== 'INPUT' && inputRef.value) {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      return
    }
    inputRef.value.focus()
  }
}

watchPostEffect(() => {
  if (messages.value.length) {
    scrollToBottom()
  }
})

onActivated(scrollToBottom)

onMounted(async () => {
  scrollToBottom()
  window.api.serverOutput((_, data: string) => {
    if (data.includes('s)! For help, type "help"')) {
      isServerRunning.value = 2
    }
    const joinedGameReg = /\[\d{2}:\d{2}:\d{2}\] \[Server thread\/INFO\]: (\w+) joined the game/
    const joinedGameResult = joinedGameReg.exec(data)
    joinedGameResult && joinedGame(joinedGameResult[1])
    const leftGameReg = /\[\d{2}:\d{2}:\d{2}\] \[Server thread\/INFO\]: (\w+) left the game/
    const leftGameResult = leftGameReg.exec(data)
    leftGameResult && leftGame(leftGameResult[1])
    if (data === '服务器以代码 0 退出') {
      isServerRunning.value = 0
    }
    messages.value.push(data)
  })
})
</script>

<style lang="scss" scoped>
.terminal {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #000;
  background-color: #1e1e1e;
  color: #ccc;
  font-family: monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
  height: calc(100% - 250px);
  overflow: auto;
  margin: 0;

  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #333333; /* 滚动条轨道颜色 */
  }

  &::-webkit-scrollbar-thumb {
    background-color: #909090; /* 滚动条颜色 */
    border-radius: 10px;
    border: 2px solid #333333; /* 滚动条内边框颜色 */
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #9f9f9f; /* 滚动条悬停颜色 */
  }

  .input-box {
    display: flex;
    align-items: center;

    span {
      margin-right: 5px;
    }

    .input {
      width: 100%;
      border: none;
      background: none;
      color: #ffffff;
      font-family: monospace;
      outline: none;
    }
  }
}
</style>
