<!--
 * @Date: 2023-06-07 17:33:49
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-08 17:47:31
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
onMounted(() => {
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
    <div>
      <!-- 主体内容 -->
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-card__body) {
  padding: 0 20px;
}
</style>