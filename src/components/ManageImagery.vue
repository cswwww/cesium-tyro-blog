<!--
 * @Date: 2023-06-07 17:33:49
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-19 14:24:07
 * @FilePath: \cesium-tyro-blog\src\components\ManageImagery.vue
 * @Description: 影像图层管理
-->
<script setup>
import { onMounted, watch } from "vue";
import EventBus from '@/common/EventBus.js'
import { ref } from 'vue'
import { viewer } from "@/utils/createCesium.js";
import { ElMessage } from 'element-plus'
import { loadTianditu, layerKey } from '@/utils/ImageryLayer/loadTianditu.js'

const activeNames = ref(['99']) // 图层列表折叠面板激活的列表项
const activeNames2 = ref(['1']) // 天地图折叠面板激活的列表项

const imageryLayers = ref([]) // 图层集信息
const isRotating = ref(false) // 刷新按钮转不转
const showAdd = ref(false) // 是否激活添加图层界面
const checked1 = ref([]) //选项

// 发送关闭弹窗的消息
const close = () => {
  EventBus.emit('PopUps', false)
}

// 新增图层
const add = () => {
  showAdd.value = !showAdd.value
  checked1.value = []
}
const addChange = () => {
  console.log(checked1);
}
// 确认新增
const confirm = () => {
  for (let i = 0; i < checked1.value.length; i++) {
    const ele = checked1.value[i];
    console.log('ele: ', ele);
    loadTianditu(ele)
  }
  add() // 返回图层列表界面
  refresh() // 刷新一下
}

// 刷新图层列表
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
  // imageryLayers.value.reverse()
}

// 控制图层显隐
const showLayer = (layer) => {
  layer.show = !layer.show
}

// 在视图上，将图层上移一层（本质上是将图层序号降低,序号低的在底层
const raiseLayer = (index) => {
  const layer = viewer.imageryLayers.get(index)
  viewer.imageryLayers.lower(layer);
  refresh()
}

// 将图层下移一层
const lowerLayer = (index, item) => {
  const layer = viewer.imageryLayers.get(index)
  viewer.imageryLayers.raise(layer)
  refresh()
}

onMounted(() => {
  refresh()
});
</script>

<template>
  <!-- 图层管理 -->
  <el-card class="box-card" v-if="!showAdd">
    <template #header>
      <div class="card-header">
        <div class="card-title">影像图层<el-icon class="refresh-icon" :class="{ 'rotate': isRotating }" @click="refresh">
            <Refresh />
          </el-icon></div>
        <div>
          <el-button class="button" text @click="add">
            <el-icon>
              <Plus />
            </el-icon>
          </el-button>
          <el-button class="button" text @click="close">
            <el-icon>
              <Close />
            </el-icon>
          </el-button>
        </div>
      </div>
    </template>
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(item, index) in imageryLayers" :name="index" :key="index">
        <template #title>
          {{ item.id }}
          <el-tooltip :content="item.show ? ' 展示图层' : '隐藏图层'" placement="bottom" effect="light">
            <el-icon class="layer-view" @click.stop="showLayer(item)">
              <View v-if="item.show" />
              <Hide v-else />
            </el-icon>
          </el-tooltip>
          <el-tooltip content="图层上移" placement="bottom" effect="light">
            <el-icon v-if="index !== 0" class="layer-view" @click.stop="raiseLayer(index)">
              <Top />
            </el-icon>
          </el-tooltip>
          <el-tooltip content="图层下移" placement="bottom" effect="light">
            <el-icon v-if="index !== imageryLayers.length - 1" class="layer-view" @click.stop="lowerLayer(index, item)">
              <Bottom />
            </el-icon>
          </el-tooltip>
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
          <el-slider v-model="item.brightness" :min="- 1" :max="1" :step="0.01" />
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

  <!-- 图层添加 -->
  <el-card class="box-card" v-else>
    <template #header>
      <div class="card-header">
        <div class="card-title">添加影像</div>
        <div>
          <el-button class="button" text @click="confirm" v-if="checked1.length !== 0">
            <el-icon>
              <Check />
            </el-icon>
          </el-button>
          <el-button class="button" text @click="add">
            <el-icon>
              <Back />
            </el-icon>
          </el-button>
          <el-button class="button" text @click="close">
            <el-icon>
              <Close />
            </el-icon>
          </el-button>
        </div>
      </div>
    </template>
    <el-collapse v-model="activeNames2">
      <el-collapse-item title="天地图" name="1">
        <el-checkbox-group v-model="checked1" @change="addChange">
          <el-checkbox v-for="(value, key) in layerKey" :label="key" :key="key">
            {{ value }}</el-checkbox>
        </el-checkbox-group>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<style scoped lang="less">
.box-card {
  width: 340px;
  .box-card();
}


.refresh-icon {
  margin-left: 5px;
  cursor: pointer;
}


:deep(.el-card__body) {
  padding: 0 20px;
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