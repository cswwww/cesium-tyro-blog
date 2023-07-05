<!--
 * @Date: 2023-06-06 18:31:24
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-04 16:40:29
 * @FilePath: \cesium-tyro-blog\src\layouts\PopUps.vue
 * @Description: 弹出窗口的界面组件
-->
<script setup>
import { ref, onMounted } from 'vue'
import EventBus from '@/common/EventBus.js'

const show = ref(false)
onMounted(() => {
  EventBus.on('PopUps', (e) => {
    console.log('e: ', e);
    if (show.value === e ) {
      show.value = false
      return
    }
    show.value = e
  })
})
</script>

<template>
  <transition name="el-fade-in">
    <div class="bar-container" v-if="show">
      <component :is="show"></component>
    </div>
  </transition>
</template>

<style scoped>
.bar-container {
  display: flex;
  position: fixed;
  right: 50px;
  top: 20px;
  background-color: aliceblue;
}
</style>