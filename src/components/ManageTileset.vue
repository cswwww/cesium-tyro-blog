<!--
 * @Date: 2023-06-07 17:33:49
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-05 16:17:39
 * @FilePath: \cesium-tyro-blog\src\components\ManageTileset.vue
 * @Description: 3D Tiles管理
-->
<script setup>
import { onMounted, watch } from "vue";
import EventBus from '@/common/EventBus.js'
import { ref } from 'vue'
import { viewer } from "@/utils/createCesium.js";
import { ElMessage } from 'element-plus'
import * as Cesium from 'cesium'
import { addThreeDTiles } from '@/utils/ThreeDTiles/loadTileset.js'
import { planeClipping } from '@/utils/ThreeDTiles/clipTileset.js'

const activeNames = ref(['99']) // 图层列表折叠面板激活的列表项

const tilesetArray = ref([]) // 3D Tiles数据集信息
const isRotating = ref(false) // 刷新按钮转不转
const showAdd = ref(false) // 是否激活添加图层界面
const input = ref('') // 输入的地址或资源id

const querySearch = [
  { value: '69380' },
  { value: '75343' },
  { value: '40866' },
  { value: '8564' },
  { value: '/src/assets/model/Tileset/sampleBuilding/tileset.json' },
]

// 发送关闭弹窗的消息
const close = () => {
  EventBus.emit('PopUps', false)
}

// 新增
const add = () => {
  showAdd.value = !showAdd.value
  input.value = ''
}

// 确认新增
const confirm = () => {
  if (/^\d/.test(input.value)) {
    input.value = parseInt(input.value)
  }
  const modelPromise = addThreeDTiles(input.value)
  modelPromise.then(model => {
    add() // 返回图层列表界面
    refresh() // 刷新一下
  })
}

// 刷新
const refresh = () => {
  isRotating.value = true;
  activeNames.value = 99
  setTimeout(() => {
    isRotating.value = false;
  }, 1000); // 控制旋转的时间，1 秒钟

  const tilesets = viewer.scene.primitives;
  tilesetArray.value = []

  for (let i = 0; i < tilesets.length; i++) {
    let primitive = tilesets.get(i);
    if (primitive instanceof Cesium.Cesium3DTileset) {
      tilesetArray.value.push(primitive);
    }
  }
}

// 控制显隐
const showLayer = (layer) => {
  layer.show = !layer.show
}

// 裁剪模型
const clipping = (item) => {
  if (item.clippingZ) {
    planeClipping(item)
  }
}

const zoomToTileset = (item) => {
  viewer.zoomTo(item)
}

onMounted(() => {
  refresh()
  if (tilesetArray.value.length == 0) {
    showAdd.value = true
  }
});
</script>

<template>
  <!-- 图层管理 -->
  <el-card class="box-card" v-if="!showAdd">
    <template #header>
      <div class="card-header">
        <div class="card-title">3D Tiles<el-icon class="refresh-icon" :class="{ 'rotate': isRotating }" @click="refresh">
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
    <el-collapse v-model="activeNames" v-if="tilesetArray.length != 0">
      <el-collapse-item v-for="(item, index) in tilesetArray" :name="index" :key="index" @click="zoomToTileset(item)">
        <template #title>
          <el-tooltip :content="item._url" placement="bottom" effect="light">
            <div class="collapse-name">
              {{ item._url }}
            </div>
          </el-tooltip>
          <el-tooltip :content="item.show ? ' 展示' : '隐藏'" placement="bottom" effect="light">
            <el-icon class="layer-view" @click.stop="showLayer(item)">
              <View v-if="item.show" />
              <Hide v-else />
            </el-icon>
          </el-tooltip>
        </template>
        <div>
          <span>Z轴平面裁剪：</span><el-switch @change="clipping(item)" v-model="item.clippingZ" />
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-alert style="margin: 5px 0;" v-else title="暂未加载3D Tiles，可点击右上方“＋”进行添加" type="info" :closable="false" />
  </el-card>

  <!-- 图层添加 -->
  <el-card class="box-card" v-else>
    <template #header>
      <div class="card-header">
        <div class="card-title">添加3D Tiles</div>
        <div>
          <el-button class="button" text @click="confirm" v-if="input !== ''">
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
    <div style="margin: 10px 0;">
      <el-autocomplete v-model="input" style="margin-bottom: 10px;" :fetch-suggestions="querySearch" clearable
        placeholder="请输入" />
      <el-alert title="请输入3D Tiles瓦片索引文件URL或者Cesium Ion Asset Id" type="info" :closable="false" />
    </div>
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

.collapse-name {
  white-space: nowrap;
  /* 禁止换行 */
  overflow: hidden;
  /* 超出部分隐藏 */
  text-overflow: ellipsis;
  /* 超出部分显示省略号 */
  width: 200px;
}

:deep(.el-popper) {
  max-width: 90vw;
}

:deep(.el-autocomplete) {
  width: 100%;
}
</style>