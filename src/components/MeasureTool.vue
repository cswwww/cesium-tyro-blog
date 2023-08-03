<!--
 * @Date: 2023-06-07 17:33:49
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-08-03 20:15:51
 * @FilePath: \cesium-tyro-blog\src\components\MeasureTool.vue
 * @Description: 测量工具
-->
<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import EventBus from '@/common/EventBus.js'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { CoordinatePicker, MeasureDistance } from '@/utils/Widgets/measureTool.js'
const radio = ref(0)

let coordinatePicker
let distance

// 发送关闭弹窗的消息
const close = () => {
  EventBus.emit('PopUps', false)
}
const toolSwitch = () => {
  coordinatePicker.destroy()
  distance.destroy()
  if (radio.value === 0) {
    coordinatePicker.start()
  } else if (radio.value === 1) {
    console.log('height: ', height);
  } else if (radio.value === 2) {
    ElMessage({
      showClose: true,
      message: '鼠标左键添加点、右键结束加点',
    })
    distance.start()
  }
}
const clear = () => {
  coordinatePicker.clear()
  distance.clear()
}

onMounted(() => {
  coordinatePicker = new CoordinatePicker()
  distance = new MeasureDistance()
  toolSwitch()
});
onUnmounted(() => {
  coordinatePicker.destroy()
  distance.destroy()
});


</script>

<template>
  <!-- 图层管理 -->
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <div class="card-title">测量工具</div>
        <div>
          <el-button class="button" text @click="clear">
            <el-icon>
              <Delete />
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
    <div>
      <!-- 主体内容 -->
      <el-radio-group @change="toolSwitch" v-model="radio" class="measure-group">
        <el-radio :label="0">坐标拾取</el-radio>
        <el-radio disabled :label="1">高度测量</el-radio>
        <el-radio :label="2">距离测量</el-radio>
        <el-radio disabled :label="3">面积测量</el-radio>
        <el-radio disabled :label="4">三角测量</el-radio>
      </el-radio-group>
    </div>
  </el-card>
  <div id="toolTip"></div>
</template>

<style scoped lang="less">
.box-card {
  .box-card();
  width: 340px;
}

.measure-group {
  flex-direction: column;

  :deep(.el-radio:last-child) {
    margin-right: auto;
  }
}

:deep(.el-card__body) {
  padding: 0 20px;
}
</style>