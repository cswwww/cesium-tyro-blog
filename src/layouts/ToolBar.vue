<!--
 * @Date: 2023-06-06 18:31:24
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-08 17:44:43
 * @FilePath: \cesium-tyro-blog\src\layouts\ToolBar.vue
 * @Description: 工具栏界面组件（用来放功能按钮的
-->
<script setup>
import { ref, onMounted } from 'vue'
import SplitImagery from '@/components/SplitImagery.vue'
import EventBus from '@/common/EventBus.js'

onMounted(() => {
})

function showIM() {
  EventBus.emit('PopUps', 'change')
}
</script>

<template>
  <el-card class="bar-container">
    <div>
      <SplitImagery />
    </div>
    <div>
      <el-button type="text" @click="showIM">图层管理</el-button>
    </div>
  </el-card>
</template>

<style scoped>
.bar-container {
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 50px;
  top: 20px;
}
</style>