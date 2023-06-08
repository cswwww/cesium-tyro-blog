<!--
 * @Date: 2023-06-07 17:33:49
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-08 17:21:47
 * @FilePath: \cesium-tyro-blog\src\components\ManageImagery.vue
 * @Description: 影像图层管理
-->
<script setup>
import { onMounted, watch } from "vue";
import EventBus from '@/common/EventBus.js'
import { ref } from 'vue'
import { viewer } from "@/utils/createCesium.js";

const activeNames = ref(['99'])
const imageryLayers = ref([])

const isRotating = ref(false);

const close = () => {
  EventBus.emit('PopUps', false)
}

const refresh = () => {
  isRotating.value = true;
  activeNames.value = 99
  setTimeout(() => {
    isRotating.value = false;
  }, 1000); // 控制旋转的时间，1 秒钟

  const layers = viewer.imageryLayers;
  imageryLayers.value = []
  for (let i = 0; i < layers.length; i++) {
    imageryLayers.value.push(layers.get(i));
    // for(const key in layers.get(i).defaultOption) {
    //   imageryLayers.value[i][key] = layers.get(i).defaultOption[key]
    // }
  }
}

const showLayer = (layer) => {
  layer.show = !layer.show
}

onMounted(() => {
  refresh()
});

</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <div class="card-title">影像图层<el-icon class="refresh-icon" :class="{ 'rotate': isRotating }" @click="refresh">
            <Refresh />
          </el-icon></div>
        <el-button class="button" text @click="close">
          <el-icon>
            <Close />
          </el-icon>
        </el-button>
      </div>
    </template>
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(item, index) in imageryLayers" :name="index">
        <template #title>
          {{ item.id }}
          <el-icon class="layer-view" @click.stop="showLayer(item)">
            <View v-if="item.show" />
            <Hide v-else />
          </el-icon>
        </template>
        <div class="slider-box">
          <span class="demonstration">透明度：</span>
          <el-slider v-model="item.alpha" :max="1" :step="0.01" />
        </div>
        <div class="slider-box">
          <span class="demonstration">日间透明度：</span>
          <el-slider v-model="item.dayAlpha" :max="1" :step="0.01" />
        </div>
        <div class="slider-box">
          <span class="demonstration">夜间透明度：</span>
          <el-slider v-model="item.nightAlpha" :max="1" :step="0.01" />
        </div>
        <div class="slider-box">
          <span class="demonstration">亮度：</span>
          <el-slider v-model="item.brightness" :min="-1" :max="1" :step="0.01" />
        </div>
        <div class="slider-box">
          <span class="demonstration">对比度：</span>
          <el-slider v-model="item.contrast" :max="3" :step="0.01" />
        </div>
        <div class="slider-box">
          <span class="demonstration">色调：</span>
          <el-slider v-model="item.hue" :max="360" :step="1" />
        </div>
        <div class="slider-box">
          <span class="demonstration">饱和度：</span>
          <el-slider v-model="item.saturation" :max="3" :step="0.01" />
        </div>
        <div class="slider-box">
          <span class="demonstration">伽马值：</span>
          <el-slider v-model="item.gamma" :min="0.01" :max="5" :step="0.01" />
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<style scoped>
.box-card {
  width: 340px;
}

.card-title {
  display: flex;
  align-items: center;
}

.refresh-icon {
  margin-left: 5px;
  cursor: pointer;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

:deep(.el-card__body) {
  padding: 0 20px;
}

.slider-box {
  display: flex;
  align-items: center;
}

.slider-box .demonstration {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 44px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}

.slider-box .demonstration+.el-slider {
  margin-right: 12px;
  flex: 0 0 60%;
}

.rotate {
  animation: rotate 1s ease-in-out;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.layer-view {
  margin-left: 5px;
}
</style>