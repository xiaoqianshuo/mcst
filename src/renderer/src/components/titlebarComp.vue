<template>
  <div class="titlebar-container">
    <div class="title">MC服务器控制台</div>
    <div class="titlebar-buttons">
      <button @click="minimizeWindow">-</button>
      <button @click="maximizeWindow">□</button>
      <button @click="closeWindow">×</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const minimizeWindow = () => {
  window.electron.ipcRenderer.send('minimize-window')
}

const maximizeWindow = () => {
  window.electron.ipcRenderer.send('maximize-window')
}

const closeWindow = () => {
  window.electron.ipcRenderer.send('close-window')
}
</script>

<style lang="scss" scoped>
.titlebar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2c3e50;
  color: white;
  height: 100%;
  padding: 0 14px;
  -webkit-app-region: drag;

  .titlebar-buttons {
    -webkit-app-region: no-drag;
    display: flex;
    align-items: center;

    button {
      margin-left: 10px;
      cursor: pointer;
      background: #34495e;
      border: none;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;

      &:hover {
        background: #1abc9c;
      }
    }
  }
}
</style>
