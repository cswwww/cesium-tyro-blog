<!--
 * @Date: 2023-06-06 18:31:24
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-27 23:42:41
 * @FilePath: \cesium-tyro-blog\src\layouts\ToolBar.vue
 * @Description: 工具栏界面组件（用来放功能按钮的
-->
<script setup>
import { ref, markRaw, onMounted } from 'vue'
import EventBus from '@/common/EventBus.js'

import SplitImagery from '@/components/SplitImagery.vue'
import SplitTileset from '@/components/SplitTileset.vue'
// 功能组件
import ManageImagery from '../components/ManageImagery.vue';
import ManageTileset from '../components/ManageTileset.vue';
import GlobalConfig from '../components/GlobalConfig.vue';
import DrawPolyline from '../components/DrawPolyline.vue';
const functionList = markRaw([
  {
    name: '全局配置',
    icon: '',
    component: GlobalConfig
  },
  {
    name: '影像图层',
    component: ManageImagery
  }, {
    name: '3D Tiles',
    icon: '',
    component: ManageTileset
  }, {
    name: '画多段线',
    icon: '',
    component: DrawPolyline
  }
])

function showIM(component) {
  EventBus.emit('PopUps', component)
  // EventBus.emit('PopUps', false) // 关闭弹窗
}


onMounted(() => {
})

</script>

<template>
  <div class="button-group">
      <el-button v-for="item in functionList" :key="item.name"  @click="showIM(item.component)">
        {{ item.name }}
      </el-button>
    </div>
  <el-card class="bar-container">
    <SplitImagery />
    <SplitTileset />
  </el-card>
</template>

<style scoped lang="less">
.bar-container {
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 50px;
  top: 50px;
}

.button-group {
  position: fixed;
  right: 10px;
  top: 10px;
  display: flex;
  flex-direction: row;
  .el-button+.el-button {
    margin: 0;
  }
}
</style>