<!--
 * @Date: 2023-06-06 16:17:18
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-15 23:44:53
 * @FilePath: \cesium-tyro-blog\src\layouts\ToolButton.vue
 * @Description: ****的按钮
-->
<script setup>
import { ref, markRaw, onMounted } from 'vue'
import EventBus from '@/common/EventBus.js'

// 功能组件
import ManageImagery from '../components/ManageImagery.vue';
import ManageTileset from '../components/ManageTileset.vue';
import GlobalConfig from '../components/GlobalConfig.vue';
import DrawPolyline from '../components/DrawPolyline.vue';
const functionList = markRaw([
  {
    name: '全局配置',
    component: GlobalConfig
  },
  {
    name: '影像图层',
    component: ManageImagery
  }, {
    name: '3D Tiles',
    component: ManageTileset
  }, {
    name: '画多段线',
    component: DrawPolyline
  }
])

function showIM(component) {
  EventBus.emit('PopUps', component)
  // EventBus.emit('PopUps', false)
}

onMounted(() => {
})
</script>

<template>
  <div class="button-group">
    <el-button v-for="item in functionList" :key="item.name" text @click="showIM(item.component)">
      {{ item.name }}
    </el-button>
  </div>
</template>

<style scoped lang="less">
.button-group {
  display: flex;
  flex-direction: column;

  .el-button+.el-button {
    margin: 0;
  }
}
</style>