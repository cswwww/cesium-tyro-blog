<script setup>
import { onMounted } from 'vue'
import { CesiumMap } from '@/utils/createCesium.js'
import { roaming } from '@/utils/Visualization/roaming.js'

import { loadTianditu } from '@/utils/ImageryLayer/loadTianditu.js'
// import { loadImagery } from '@/utils/ImageryLayer/loadImagery.js'

import ToolBar from './layouts/ToolBar.vue'
import PopUps from './layouts/PopUps.vue'

import { PolygonDrawer } from '@/utils/Entity/Draw/polygon.js'
import { areaClipping } from '@/utils/Visualization/clippingToCanyon.js'

onMounted(() => {
  new CesiumMap('cesiumContainer')
  // loadImagery.cartoVoyager()
  loadTianditu('img')
  loadTianditu('cia')
  // roaming() // 开启入场漫游

  const polygonDrawer = new PolygonDrawer((polygon, pointList) => {
    areaClipping(pointList)
  })
  polygonDrawer.start()
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
