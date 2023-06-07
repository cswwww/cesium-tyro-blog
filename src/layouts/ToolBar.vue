<!--
 * @Date: 2023-06-06 18:31:24
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-07 10:33:19
 * @FilePath: \cesium-tyro-blog\src\layouts\ToolBar.vue
 * @Description: 工具栏界面组件（用来放功能按钮的
-->
<script setup>
import { ref, onMounted } from 'vue'
import SplitImagery from '@/components/SplitImagery.vue'

onMounted(() => {
})
</script>

<template>
  <div class="bar-container">
    <SplitImagery />
  </div>
</template>

<style scoped>
.bar-container {
  display: flex;
  position: fixed;
  left: 50px;
  top: 20px;
  background-color: aliceblue;
}
</style>