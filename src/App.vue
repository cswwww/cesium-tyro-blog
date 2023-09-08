<script setup>
import { onMounted } from 'vue'
import { CesiumMap } from '@/utils/createCesium.js'
import { roaming } from '@/utils/Visualization/roaming.js'

import { loadTianditu } from '@/utils/ImageryLayer/loadTianditu.js'
import { loadImagery } from '@/utils/ImageryLayer/loadImagery.js'

import ToolBar from './layouts/ToolBar.vue'
import PopUps from './layouts/PopUps.vue'

onMounted(() => {
  new CesiumMap('cesiumContainer')
  loadImagery.cartoVoyager()
  // loadTianditu('img')
  // loadTianditu('cia')
  // roaming() // 开启入场漫游
})
</script>

<template>
  <div id="cesiumContainer" />
  <ToolBar />
  <PopUps />
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
