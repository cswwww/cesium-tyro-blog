<!--
 * @Date: 2023-06-06 18:31:24
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-28 19:46:06
 * @FilePath: \cesium-tyro-blog\src\layouts\ToolBar.vue
 * @Description: 工具栏界面组件（用来放功能按钮的
-->
<script setup>
import { ref, markRaw, onMounted } from 'vue'
import EventBus from '@/common/EventBus.js'
import { functionList } from '@/common/ButtonList.js'

import SplitImagery from '@/components/SplitImagery.vue'
import SplitTileset from '@/components/SplitTileset.vue'

function showIM(component) {
  EventBus.emit('PopUps', component)
  // EventBus.emit('PopUps', false) // 关闭弹窗
}
</script>

<template>
  <div class="button-group">
    <el-tooltip v-for="item in functionList" :key="item.name" :content="item.name" placement="bottom" effect="light">
      <el-button circle @click="showIM(item.component)">
        <img :src="item.icon" alt="" srcset="">
      </el-button>
    </el-tooltip>
    <SplitImagery />
    <SplitTileset />
  </div>
</template>

<style scoped lang="less">
.button-group {
  position: fixed;
  right: 16px;
  top: 16px;
  display: flex;
  flex-direction: row;

  :deep(.el-button) {
    margin-left: 10px;
    height: auto;
  }

  img {
    width: 20px;
    height: 20px;
  }
}
</style>