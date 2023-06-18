<script setup>
import { onMounted } from "vue";
import { CesiumMap, viewer } from "@/utils/createCesium.js";
import { loadImagery } from "@/utils/ImageryLayer/loadImagery.js";
import ToolBar from "./layouts/ToolBar.vue";
import PopUps from "./layouts/PopUps.vue";
import { loadGeoJSON, CesiumGeoJSON } from '@/utils/VectorData/loadGeoJSON.js'
import { Polygon } from '@/utils/VectorData/setEntity.js'
import pointSample from '@/assets/geojson/point.json' // 示例点要素
import collectionSample from '@/assets/geojson/collection.json' // 示例要素集合
import lineSample from '@/assets/geojson/line.json' // 示例线要素

onMounted(() => {
  new CesiumMap("cesiumContainer");
  loadImagery.cartoVoyager();
  // loadGeoJSON().then(data => {
  //   Polygon(data)
  // })
  const jsonInstance = new CesiumGeoJSON(collectionSample);

  setTimeout(() => {
    jsonInstance.update(pointSample) // 更新数据
    jsonInstance.add(lineSample) // 添加数据
    jsonInstance.destroy() // 销毁
  }, 2000);
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
