<!--
 * @Date: 2023-06-07 17:33:49
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-31 18:49:02
 * @FilePath: \cesium-tyro-blog\src\components\MeasureTool.vue
 * @Description: 测量工具
-->
<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import EventBus from '@/common/EventBus.js'
import { ref } from 'vue'
import { viewer } from "@/utils/createCesium.js";
import { ElMessage } from 'element-plus'
import { pickCursor } from '@/utils/Event/cursorEvent.js'
import { coordinatePicker } from '@/utils/Widgets/measureTool.js'

const radio = ref(0)

// 发送关闭弹窗的消息
const close = () => {
  EventBus.emit('PopUps', false)
}
onMounted(() => {
});
onUnmounted(() => {
  pickCursor(false)
});

const toolSwitch = () => {
  if (radio.value = 3) {
    pickCursor()
  }
}
</script>

<template>
  <!-- 图层管理 -->
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <div class="card-title">测量工具</div>
        <div>
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
        <el-radio :label="3">坐标拾取</el-radio>
        <el-radio disabled :label="6">距离测量</el-radio>
        <el-radio disabled :label="9">面积测量</el-radio>
        <el-radio disabled :label="9">三角测量</el-radio>
      </el-radio-group>
    </div>
  </el-card>
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