<script setup>
import { onMounted } from 'vue'
import { CesiumMap } from '@/utils/createCesium.js'

onMounted(() => {
  new CesiumMap('cesiumContainer')
})
</script>

<template>
  <div id="cesiumContainer"/>
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
