<!--
 * @Date: 2023-06-06 18:31:24
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-09-08 18:30:35
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

    <Teleport to="body">
      <div class="closeButton">
        <el-button v-if="sceneFlag" circle @click="sceneFlag = ''"  style="background-color: #ACB4C0;border: none;">
          <svg t="1694168560335" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="13686" width="20" height="20">
            <path
              d="M557.248 512l339.424 339.424-45.248 45.248L512 557.248 172.576 896.672 127.36 851.424 466.752 512 127.328 172.576 172.576 127.36 512 466.752 851.424 127.328l45.248 45.248z"
              fill="#5D6D7E" p-id="13687"></path>
          </svg>
        </el-button>
      </div>
    </Teleport>
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

.closeButton {
  position: fixed;
  right: 16px;
  top: 66px;
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
