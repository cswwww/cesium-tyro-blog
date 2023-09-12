<!--
 * @Date: 2023-06-07 17:33:49
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-09-12 15:18:53
 * @FilePath: \cesium-tyro-blog\src\components\DrawPolyline.vue
 * @Description: 绘图工具
-->
<script setup>
import { onUnmounted } from 'vue'
import EventBus from '@/common/EventBus.js'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

import { PolylineDrawer } from '@/utils/Entity/Draw/polyline.js'
import { PolygonDrawer } from '@/utils/Entity/Draw/polygon.js'

const activeNames = ref(['99']) // 图层列表折叠面板激活的列表项
const polylineDrawer = new PolylineDrawer()
const polygonDrawer = new PolygonDrawer()

// 发送关闭弹窗的消息
const close = () => {
  EventBus.emit('PopUps', false)
}

const toolSwitch = () => {
  polygonDrawer.destroy()
  polylineDrawer.destroy()
  if (activeNames.value === 0) {
    polylineDrawer.start()
    ElMessage({
      showClose: true,
      message: '鼠标左键添加点、右键完成绘制'
    })
  } else if (activeNames.value === 1) {
    polygonDrawer.start()
    ElMessage({
      showClose: true,
      message: '鼠标左键添加点、右键完成绘制'
    })
  }
}

onUnmounted(() => {
  polygonDrawer.destroy()
  polylineDrawer.destroy()
})
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <div class="card-title">绘制</div>
        <div>
          <el-button class="button" text @click="close">
            <el-icon>
              <Close />
            </el-icon>
          </el-button>
        </div>
      </div>
    </template>

    <el-radio-group @change="toolSwitch" v-model="activeNames" class="measure-group">
      <el-radio :label="0">绘制线</el-radio>
      <el-radio :label="1">绘制面</el-radio>
    </el-radio-group>
  </el-card>
</template>

<style scoped lang="less">
.box-card {
  width: 340px;
  .box-card();
}

:deep(.el-card__body) {
  padding: 0 20px;
}

.measure-group {
  flex-direction: column;

  :deep(.el-radio:last-child) {
    margin-right: auto;
  }
}
</style>
