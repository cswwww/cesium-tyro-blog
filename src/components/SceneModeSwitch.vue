<!--
 * @Date: 2023-07-28 19:20:42
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-28 19:24:22
 * @FilePath: \cesium-tyro-blog\src\components\SceneModeSwitch.vue
 * @Description: 全局配置组件：场景切换
 * https://cesium.com/learn/cesiumjs/ref-doc/global.html?classFilter=SCENE#SceneMode
-->

<script setup>
import { onMounted, ref } from "vue";
import { viewer } from "@/utils/createCesium.js"; // ! 引入场景对象

const sceneMode = ref(3)

const changeSceneMode = () => {
  const modeMap = { // duration 为完成过渡动画的时间（以秒为单位）
    '1': { method: viewer.scene.morphToColumbusView, duration: 2 },
    '2': { method: viewer.scene.morphTo2D, duration: 2 },
    '3': { method: viewer.scene.morphTo3D, duration: 2 }
  };

  const selectedMode = modeMap[sceneMode.value];
  if (selectedMode) {
    const { method, duration } = selectedMode;
    method.call(viewer.scene, duration);
  }
}

onMounted(() => {
  sceneMode.value = viewer.scene.mode
});
</script>

<template>
  <div class="card-item">
    <div class="card-label">场景模式</div>
    <el-radio-group v-model="sceneMode" @change="changeSceneMode()">
      <el-radio-button label="2">2D</el-radio-button>
      <el-radio-button label="3">3D</el-radio-button>
      <el-radio-button label="1">COLUMBUS</el-radio-button>
    </el-radio-group>
  </div>
</template>

<style scoped lang="less">
.box-card {
  .box-card();
  width: 340px;
}
</style>