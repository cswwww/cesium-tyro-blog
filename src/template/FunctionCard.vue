<!--
 * @Date: 2023-06-07 17:33:49
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-04 16:37:15
 * @FilePath: \cesium-tyro-blog\src\template\FunctionCard.vue
 * @Description: 管理
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
  <!-- 图层管理 -->
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <div class="card-title">标题内容</div>
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