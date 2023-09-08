<!--
 * @Date: 2023-06-06 16:17:18
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-09-08 17:22:01
 * @FilePath: \cesium-tyro-blog\src\useScene\SplitTileset.vue
 * @Description: 3D Tiles 瓦片集卷帘（分割）的功能（按钮）组件
-->
<script setup>
import { ref, onMounted, defineProps, watch } from 'vue'
import { splitTileset } from '@/utils/ThreeDTiles/splitTileset.js'
const props = defineProps({
  sceneFlag: {
    type: String,
    required: true
  }
})
const flag = ref(1)
const splitInstance = ref(0)
const emit = defineEmits(['update:sceneFlag'])

function action() {
  if (flag.value) {
    emit('update:sceneFlag', 'splitTileset')
    splitInstance.value.actionSplit()
    flag.value = false
  } else {
    splitInstance.value.stopSplit()
    flag.value = true
  }
}

onMounted(() => {
  splitInstance.value = new splitTileset()
})
watch(
  () => props.sceneFlag,
  (val) => {
    if (val === 'splitTileset') {
      console.log('启动splitTileset')
    } else {
      if (!flag.value) {
        console.log('关闭splitTileset')
        splitInstance.value.stopSplit()
        flag.value = true
      }
    }
  }
)

</script>

<template>
  <el-card shadow="hover" @click="action" style="cursor: pointer;">
    <div style="text-align: center;">
      <svg t="1690530131307" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="13982" width="20" height="20">
        <path
          d="M112.96 576a446.592 446.592 0 0 1-4.576-64C108.384 282.24 282.24 112.512 512 112.512S916.608 282.24 916.608 512c0 21.76-1.568 43.136-4.608 64H112.96z"
          fill="#FFFFFF" p-id="13983"></path>
        <path
          d="M100.896 576c-3.2-20.864-4.896-42.24-4.896-64C96 282.304 282.24 96 512.032 96 741.76 96 928 282.304 928 512c0 21.76-1.664 43.136-4.896 64h-32.416c3.52-20.8 5.312-42.208 5.312-64 0-212.064-171.936-384-384-384S128 299.936 128 512c0 21.792 1.824 43.2 5.312 64H100.896zM96 608h832v96H96v-96z"
          fill="#5D6D7E" p-id="13984"></path>
        <path
          d="M752.192 576H595.52c-29.312-63.904-77.728-72.384-96.896-76.128-29.984-5.76-54.464-8.704-54.464-46.336 0-37.6 47.648-50.624 65.312-46.272 17.664 4.256 40.8-59.392-21.824-92.608-62.528-33.344-84.288 27.424-97.856 81.024-13.632 53.568-38.144 39.04-43.616-23.168-5.376-62.24-20.32-14.432-32.64 11.584-12.192 26.048-81.632 57.856-87.008 34.752-3.392-14.496 1.696-47.232 6.016-69.6 62.688-97.824 168.192-161.984 287.776-161.984 129.792 0 242.72 75.68 302.688 187.648 6.08 54.72-20.096 103.936-52.32 113.376-39.488 11.584-32.64 57.856-32.64 57.856 6.048 10.944 10.688 20.8 14.08 29.856zM96 896h832v32H96v-32z"
          fill="#ACB4C0" p-id="13985"></path>
        <path d="M96 768h832v64H96z" fill="#808FA1" p-id="13986"></path>
      </svg>
    </div>
    <div style="text-align: center;">{{ flag ? '开启模型卷帘' : '关闭模型卷帘' }}</div>
  </el-card>
</template>
