<!--
 * @Date: 2023-09-11 11:56:32
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-09-12 15:02:05
 * @FilePath: \cesium-tyro-blog\src\layouts\SceneGroup.vue
 * @Description: 场景应用功能组
-->

<script setup>
import { ref, markRaw } from 'vue'

import SplitImagery from '@/useScene/SplitImagery.vue'
import SplitTileset from '@/useScene/SplitTileset.vue'
import AncientEarth from '@/useScene/AncientEarth.vue'
import LoadMaterial from '@/useScene/LoadMaterial.vue'

const sceneFlag = ref('')
const scenelist = markRaw([
  { components: SplitImagery, ref: ref(null) },
  { components: SplitTileset, ref: ref(null) },
  { components: AncientEarth, ref: ref(null) },
  { components: LoadMaterial, ref: ref(null) }
])

const activateButton = (index) => {
  const targetButton = scenelist[index].ref.value[0]

  if (sceneFlag.value === index) { // 关闭场景
    targetButton.closeScene()
    sceneFlag.value = ''
  } else if (sceneFlag.value === '') { // 进入场景
    sceneFlag.value = index
    targetButton.actionScene()
  } else { // 切换场景
    scenelist[sceneFlag.value].ref.value[0].closeScene()
    sceneFlag.value = index
    targetButton.actionScene()
  }
}

</script>

<template>
  <el-popover :width="320" trigger="click" :popper-options="{ boundariesElement: 'viewport', removeOnDestroy: true }"
    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
    <template #reference>
      <el-button circle style="background-color: #ACB4C0;border: none;">
        <img src="../assets/images/模式.svg">
      </el-button>
    </template>
    <template #default>
      <div style="font-size: 18px;font-weight: bold;">应用场景</div>
      <el-divider />
      <div style="width: 100%;margin: auto 0;text-align: center;">
        <div v-for="(item, index) in scenelist" :key="index" @click="activateButton(index)"
          :class="['sceneCard', sceneFlag === index ? 'active' : '']">
          <component :is="item.components" :ref="item.ref" />
        </div>
      </div>

    </template>
  </el-popover>

  <Teleport to="body">
    <div class="closeButton" v-if="sceneFlag">
      <el-button circle @click="activateButton(sceneFlag)" style="background-color: #ACB4C0;border: none;">
        <svg t="1694168560335" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="13686" width="20" height="20">
          <path
            d="M557.248 512l339.424 339.424-45.248 45.248L512 557.248 172.576 896.672 127.36 851.424 466.752 512 127.328 172.576 172.576 127.36 512 466.752 851.424 127.328l45.248 45.248z"
            fill="#fff" p-id="13687"></path>
        </svg>
      </el-button>
    </div>
  </Teleport>
</template>

<style scoped lang="less">
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
}

.sceneCard {
  display: inline-block;
  margin-right: 6px;
  border: 1px solid rgba(255, 0, 0, 0);
  user-select: none;
}

.active {
  border: 1px solid red;
}
</style>
