<script setup>
import { onMounted } from "vue";
import { CesiumMap, viewer } from "@/utils/createCesium.js";
import { loadImagery } from "@/utils/ImageryLayer/loadImagery.js";

onMounted(() => {
  new CesiumMap("cesiumContainer");
  const cartoDark = loadImagery.cartoDark();
  console.log("获取图层的索引号: ", viewer.imageryLayers.indexOf(cartoDark));
});
</script>

<template>
  <div id="cesiumContainer" />
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
