<script setup>
import { onMounted } from "vue";
import { CesiumMap, viewer } from "@/utils/createCesium.js";
import { loadImagery } from "@/utils/ImageryLayer/loadImagery.js";
import SplitImagery from '@/components/SplitImagery.vue'
import ToolBar from "./layouts/ToolBar.vue";
onMounted(() => {
  new CesiumMap("cesiumContainer");
  const cartoDark = loadImagery.cartoDark();
});
</script>

<template>
  <div id="cesiumContainer" />
  <ToolBar>
    <SplitImagery />
  </ToolBar>
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
