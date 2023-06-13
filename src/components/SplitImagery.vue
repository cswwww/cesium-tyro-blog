<!--
 * @Date: 2023-06-06 16:17:18
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-09 16:43:14
 * @FilePath: \cesium-tyro-blog\src\components\SplitImagery.vue
 * @Description: 影像图层卷帘（分割）的功能（按钮）组件
-->
<script setup>
import { ref, onMounted } from 'vue'
import { splitImagery } from '@/utils/ImageryLayer/splitImagery.js'

let flag = ref(1)
let splitInstance = ref(0)

function action() {
  if (flag.value) {
    splitInstance.actionSplit()
  } else {
    splitInstance.stopSplit()
  }
  flag.value = !flag.value
}

onMounted(() => {
  splitInstance = new splitImagery()
})
</script>

<template>
  <el-button text @click="action">二维分割</el-button>
</template>