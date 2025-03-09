<script setup>
import { onMounted, ref } from 'vue'
import { CesiumMap, viewer } from '@/utils/createCesium.js'
// import { roaming } from '@/utils/Visualization/roaming.js'

import { loadTianditu } from '@/utils/ImageryLayer/loadTianditu.js'

import ToolBar from './layouts/ToolBar.vue'
import PopUps from './layouts/PopUps.vue'

onMounted(() => {
  new CesiumMap('cesiumContainer')
  loadTianditu('img')
  loadTianditu('cia')
  // roaming()
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
