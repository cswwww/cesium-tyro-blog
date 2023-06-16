<!--
 * @Date: 2023-06-06 16:17:18
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-15 09:35:40
 * @FilePath: \cesium-tyro-blog\src\components\SplitTileset.vue
 * @Description: 3D Tiles 瓦片集卷帘（分割）的功能（按钮）组件
-->
<script setup>
import { ref, onMounted } from 'vue'
import { splitTileset } from '@/utils/ThreeDTiles/splitTileset.js'

let flag = ref(1)
let splitInstance = ref(0)

function action() {
  if (flag.value) {
    splitInstance.value.actionSplit()
  } else {
    splitInstance.value.stopSplit()
  }
  flag.value = !flag.value
}

onMounted(() => {
  splitInstance.value = new splitTileset()
})
</script>

<template>
  <div>
    <el-button text @click="action">{{flag?'模型':'关闭'}}分割</el-button>
  </div>
</template>