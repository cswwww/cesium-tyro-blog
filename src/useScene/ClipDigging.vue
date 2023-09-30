<!--
 * @Date: 2023-06-06 16:17:18
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-09-30 15:10:22
 * @FilePath: \cesium-tyro-blog\src\useScene\AreaClipping.vue
 * @Description: 组件
-->
<script setup>
import { ref } from 'vue'
import { areaClipping } from '@/utils/Visualization/clippingToCanyon.js'
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

const flag = ref(1)

const points = [
  {
    'x': 831378.7404354169,
    'y': -4856690.379372356,
    'z': 4036359.538261747
  },
  {
    'x': 3334347.320785613,
    'y': -4763032.687230717,
    'z': 2613474.0729391705
  },
  {
    'x': 133401.66014090632,
    'y': -6152120.724266897,
    'z': 1671946.9335355863
  }
]

const actionScene = () => {
  flag.value = false

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(-74.63329347894917, 28.715833526, 20000000)
  })

  areaClipping(points, false)
}
const closeScene = () => {
  flag.value = true
  viewer.scene.globe.clippingPlanes = null // 销毁
}

defineExpose({
  actionScene,
  closeScene
})
</script>

<template>
  <el-card shadow="hover" style="cursor: pointer;">
    <div style="text-align: center;">
      <svg t="1696056449962" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="13677" width="20" height="20">
        <path d="M512 273.888l-400 200v172.224l400 200 400-200v-172.224L512 273.888z" fill="#FFFFFF" p-id="13678"></path>
        <path
          d="M528 820.224l368-184v-152.448l-384-192-384 192v152.448l368 184V624h32v196.224zM512 256l416 208v192L512 864 96 656v-192L512 256z"
          fill="#5D6D7E" p-id="13679"></path>
        <path d="M512 256l416 208L512 672 96 464 512 256z m0.832 87.232L288 464l224 112 224-112-223.168-120.768z"
          fill="#C49F74" p-id="13680"></path>
      </svg>
    </div>
    <div style="text-align: center;">{{ flag ? '地形裁剪挖除' : '关闭地形裁剪' }}</div>
  </el-card>
</template>
