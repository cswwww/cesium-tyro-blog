<!--
 * @Date: 2023-06-07 17:33:49
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-19 14:14:51
 * @FilePath: \cesium-tyro-blog\src\components\GlobalConfig.vue
 * @Description: 全局配置组件：场景、地球
-->
<script setup>
import { onMounted, watch } from "vue";
import EventBus from '@/common/EventBus.js'
import { ref } from 'vue'
import { viewer } from "@/utils/createCesium.js";
import { ElMessage } from 'element-plus'

// 发送关闭弹窗的消息
const close = () => {
  EventBus.emit('PopUps', false)
}

const switchList = ref([
  {
    label: '显示fps',
    state: viewer.scene.debugShowFramesPerSecond, // 状态
    bind: viewer.scene, // 对应的对象
    type: 'debugShowFramesPerSecond', // 对应的属性名
  }, {
    label: 'HDR效果',
    state: viewer.scene.highDynamicRange, // 状态
    bind: viewer.scene, // 对应的对象
    type: 'highDynamicRange', // 对应的属性名
  }, {
    label: '月亮',
    state: viewer.scene.moon.show, // 状态
    bind: viewer.scene.moon, // 对应的对象
    type: 'show', // 对应的属性名
  }, {
    label: '太阳',
    state: viewer.scene.sun.show, // 状态
    bind: viewer.scene.sun, // 对应的对象
    type: 'show', // 对应的属性名
  }, {
    label: '天空盒',
    state: viewer.scene.skyBox.show, // 状态
    bind: viewer.scene.skyBox, // 对应的对象
    type: 'show', // 对应的属性名
  }, {
    label: '天空大气',
    state: viewer.scene.skyAtmosphere.show, // 状态
    bind: viewer.scene.skyAtmosphere, // 对应的对象
    type: 'show', // 对应的属性名
  }, {
    label: '雾',
    state: viewer.scene.fog.enabled, // 状态
    bind: viewer.scene.fog, // 对应的对象
    type: 'enabled', // 对应的属性名
  }, {
    label: '昼夜',
    state: viewer.scene.globe.enableLighting, // 状态
    bind: viewer.scene.globe, // 对应的对象
    type: 'enableLighting', // 对应的属性名
  }, {
    label: '地表大气',
    state: viewer.scene.globe.showGroundAtmosphere, // 状态
    bind: viewer.scene.globe, // 对应的对象
    type: 'showGroundAtmosphere', // 对应的属性名
  }, {
    label: '泛光效果',
    state: viewer.scene.postProcessStages.bloom.enabled, // 状态
    bind: viewer.scene.postProcessStages.bloom, // 对应的对象
    type: 'enabled', // 对应的属性名
  }
])


const handleSwitch = (item) => {
  console.log('item: ', item);
  item.bind[item.type] = item.state
}

onMounted(() => {
  viewer.scene.moon.show = true
});
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <div class="card-title">全局配置</div>
        <div>
          <el-button class="button" text @click="close">
            <el-icon>
              <Close />
            </el-icon>
          </el-button>
        </div>
      </div>
    </template>
    <div style="margin-top: 10px;">
      <div class="card-item" v-for="(item, index) in switchList" :key="index">
        <div class="card-label">{{ item.label }}</div>
        <el-switch v-model="item.state" @change="handleSwitch(item)" />
      </div>
      <!-- 主体内容 -->
    </div>
  </el-card>
</template>

<style scoped lang="less">
.box-card {
  .box-card();
  width: 340px;
}

:deep(.el-card__body) {
  padding: 0 20px;
}
</style>