<script setup>
import { onMounted } from "vue";
import { CesiumMap, viewer } from "@/utils/createCesium.js";
import { loadImagery } from "@/utils/ImageryLayer/loadImagery.js";
import ToolBar from "./layouts/ToolBar.vue";
import PopUps from "./layouts/PopUps.vue";

import {add} from '@/utils/Entity/model.js'

onMounted(() => {
  new CesiumMap("cesiumContainer");
  loadImagery.cartoVoyager();
  const point = add()
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
