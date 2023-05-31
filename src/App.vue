<script setup>
import { onMounted } from 'vue'
import * as Cesium from 'cesium'

onMounted(() => {
  const map = new Cesium.Viewer('cesiumContainer')
})
</script>

<template>
  <div id="cesiumContainer"/>
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  max-height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
