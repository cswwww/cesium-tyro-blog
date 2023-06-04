<script setup>
import { onMounted } from "vue";
import { CesiumMap } from "@/utils/createCesium.js";
import { darkImagery } from "@/utils/ImageryLayer/loadImagery.js";

onMounted(() => {
  new CesiumMap("cesiumContainer");
  darkImagery();
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
