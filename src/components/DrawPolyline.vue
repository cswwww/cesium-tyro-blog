<!--
 * @Date: 2023-06-07 17:33:49
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-17 08:37:28
 * @FilePath: \cesium-tyro-blog\src\components\DrawPolyline.vue
 * @Description: 全局配置组件：场景、地球
-->
<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import EventBus from '@/common/EventBus.js'
import { ref } from 'vue'
import { viewer } from "@/utils/createCesium.js";
import { ElMessage } from 'element-plus'
import { PolylineDrawer } from '@/utils/Entity/Draw/polyline.js'

const lineEntityCollection = ref({})
const rendering = ref(0)
const activeNames = ref(['99']) // 图层列表折叠面板激活的列表项

// 发送关闭弹窗的消息
const close = () => {
  EventBus.emit('PopUps', false)
  polylineDrawer.destroy()
}

onMounted(() => {
  polylineDrawer.start();
  ElMessage({
    showClose: true,
    message: '鼠标左键添加点、右键完成绘制',
  })
  lineEntityCollection.value = polylineDrawer.lineCollection.entities.values
});
onUnmounted(() => {
  polylineDrawer.destroy()
})
const getLineCollection = (list) => {
  lineEntityCollection.value = list.entities.values
  rendering.value++
}

const polylineDrawer = new PolylineDrawer(getLineCollection);

</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <div class="card-title">画多段线</div>
        <div>
          <el-button class="button" text @click="close">
            <el-icon>
              <Close />
            </el-icon>
          </el-button>
        </div>
      </div>
    </template>
    <el-collapse v-model="activeNames" :key="rendering">
      <el-collapse-item v-for="(item, index) in lineEntityCollection" :key="index" :name="index">
        <template #title>
          <div class="collapse-name">
            第{{ index + 1 }}条
          </div>
        </template>
        <div class="card-item">
          <div class="card-label">暂无拓展</div>
        </div>
      </el-collapse-item>
    </el-collapse>
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
</style>