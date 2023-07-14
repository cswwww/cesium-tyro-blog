<script setup>
import { onMounted } from "vue";
import { CesiumMap, viewer } from "@/utils/createCesium.js";
import { loadImagery } from "@/utils/ImageryLayer/loadImagery.js";
import ToolBar from "./layouts/ToolBar.vue";
import PopUps from "./layouts/PopUps.vue";

import { PolylineDrawer } from '@/utils/Entity/Draw/polyline.js'
onMounted(() => {
  new CesiumMap("cesiumContainer");
  loadImagery.cartoVoyager();

  const polylineDrawer = new PolylineDrawer();
  polylineDrawer.start();
  
  setTimeout(() => {
    polylineDrawer.destroy()
  }, 5000);
});
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
