<!--
 * @Date: 2023-06-06 18:31:24
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-04 20:36:47
 * @FilePath: \cesium-tyro-blog\src\layouts\ToolBar.vue
 * @Description: 工具栏界面组件（用来放功能按钮的
-->
<script setup>
import { ref, onMounted } from 'vue'
import SplitImagery from '@/components/SplitImagery.vue'
import SplitTileset from '@/components/SplitTileset.vue'
import ToolButton from './ToolButton.vue'

onMounted(() => {
})

</script>

<template>
  <el-card class="bar-container">
    <ToolButton />
    <SplitImagery />
    <SplitTileset />
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