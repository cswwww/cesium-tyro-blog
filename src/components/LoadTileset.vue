<!--
 * @Date: 2023-06-06 16:17:18
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-16 12:06:20
 * @FilePath: \cesium-tyro-blog\src\components\LoadTileset.vue
 * @Description: 加载3D Tiles
-->
<script setup>
import { ref, onMounted } from 'vue'
import { addThreeDTiles } from '@/utils/ThreeDTiles/loadTileset.js'
import * as Cesium from 'cesium'
import { viewer } from "@/utils/createCesium.js";

const flag = ref(1)
let Tileset = {} // 存放模型对象

function action() {
  if (flag.value) {
    const modelPromise = addThreeDTiles(75343)
    modelPromise.then(model => {
      Tileset = model
    })
  } else {
    viewer.scene.primitives.remove(Tileset);
    Tileset = {}
  }
  flag.value = !flag.value
}

onMounted(() => {
})
</script>

<template>
  <div>
    <el-button text @click="action">{{flag?'添加':'移除'}}模型</el-button>
  </div>
</template>