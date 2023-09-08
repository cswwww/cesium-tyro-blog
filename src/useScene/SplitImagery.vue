<!--
 * @Date: 2023-06-06 16:17:18
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-09-08 17:28:50
 * @FilePath: \cesium-tyro-blog\src\useScene\SplitImagery.vue
 * @Description: 影像图层卷帘（分割）的功能（按钮）组件
-->
<script setup>
import { ref, onMounted, defineProps, watch } from 'vue'
import { splitImagery } from '@/utils/ImageryLayer/splitImagery.js'
const props = defineProps({
  sceneFlag: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['update:sceneFlag'])

const flag = ref(1)
const splitInstance = ref(0)

function action() {
  if (flag.value) {
    emit('update:sceneFlag', 'SplitImagery')

    splitInstance.value.actionSplit()
    flag.value = false
  } else {
    splitInstance.value.stopSplit()
    flag.value = true
  }
}

onMounted(() => {
  splitInstance.value = new splitImagery()
})
watch(
  () => props.sceneFlag,
  (val) => {
    if (val === 'SplitImagery') {
      console.log('启动SplitImagery')
    } else {
      if (!flag.value) {
        console.log('关闭SplitImagery')
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
      <svg t="1690529118818" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="13818" width="20" height="20">
        <path d="M128 128h768v512H128z" fill="#FFFFFF" p-id="13819"></path>
        <path
          d="M160 608V160h320c85.344 64 128 117.344 128 160 0 27.616-82.592 30.496-128 144-15.968 39.904-28 98.56-55.136 144H160z m443.712 0h-57.728A257.76 257.76 0 0 1 544 576c0-42.656 21.344-85.344 64-128v128c0 7.808-1.44 18.464-4.288 32z m261.632 0h-173.056c-30.848-59.2-26.496-112.544 13.056-160 53.312-64 53.312-106.656 0-128l160-160v448z"
          fill="#ACB4C0" p-id="13820"></path>
        <path
          d="M128 640h768V128H128v512zM928 118.144V704H96V118.144C96 105.92 110.336 96 128 96h768c17.664 0 32 9.92 32 22.144z"
          fill="#5D6D7E" p-id="13821"></path>
        <path d="M96 768h832v64H96z" fill="#808FA1" p-id="13822"></path>
        <path d="M96 896h832v32H96z" fill="#ACB4C0" p-id="13823"></path>
      </svg>
    </div>
    <div style="text-align: center;">{{ flag ? '开启影像卷帘' : '关闭影像卷帘' }}</div>
  </el-card>
</template>
