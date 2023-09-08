<!--
 * @Date: 2023-06-06 18:31:24
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-09-08 17:01:33
 * @FilePath: \cesium-tyro-blog\src\layouts\ToolBar.vue
 * @Description: 工具栏界面组件（用来放功能按钮的
-->
<script setup>
import { ref, markRaw, onMounted } from 'vue'
import EventBus from '@/common/EventBus.js'
import { functionList } from '@/common/ButtonList.js'

import SplitImagery from '@/useScene/SplitImagery.vue'
import SplitTileset from '@/useScene/SplitTileset.vue'
import AncientEarth from '@/useScene/AncientEarth.vue'

const sceneFlag = ref('')

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

    <el-popover :width="340" trigger="click"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
      <template #reference>
        <el-button circle style="background-color: #ACB4C0;border: none;">
          <img src="../assets/images/模式.svg">
        </el-button>
      </template>
      <template #default>
        <div style="font-size: 18px;font-weight: bold;">应用场景</div>
        <el-divider />
        <el-row :gutter="20">
          <el-col :span="12">
            <SplitImagery v-model:sceneFlag="sceneFlag" />
          </el-col>
          <el-col :span="12">
            <SplitTileset v-model:sceneFlag="sceneFlag" />
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <AncientEarth v-model:sceneFlag="sceneFlag" />
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
      </template>
    </el-popover>
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
