<!--
 * @Date: 2023-06-06 16:17:18
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-09-11 22:44:17
 * @FilePath: \cesium-tyro-blog\src\template\SceneCard.vue
 * @Description: 组件
-->
<script setup>
import { ref, onMounted, defineProps, watch } from 'vue'

const flag = ref(1)

const actionScene = () => {
  flag.value = false
}
const closeScene = () => {
  flag.value = true
}
onMounted(() => {
})

defineExpose({
  actionScene,
  closeScene
})
</script>

<template>
  <el-card shadow="hover" style="cursor: pointer;">
    <div style="text-align: center;">
      <svg>
      </svg>
    </div>
    <div style="text-align: center;">{{ flag ? '开启' : '关闭' }}</div>
  </el-card>
</template>
