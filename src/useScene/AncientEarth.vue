<!--
 * @Date: 2023-06-06 16:17:18
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-09-08 17:48:14
 * @FilePath: \cesium-tyro-blog\src\useScene\ancientEarth.vue
 * @Description: 古地球场景
-->
<script setup>
import { ref, onMounted, reactive, defineProps, watch } from 'vue'
import { saveImageryLayers, reloadImageryLayers } from '@/utils/ImageryLayer/setImagery.js'
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'
const props = defineProps({
  sceneFlag: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['update:sceneFlag'])

const flag = ref(null)
const historyList = ref([
  { year: '6亿年前', file: '600Marect', name: 'Ediacaran Period', label: '埃迪卡拉纪', explain: '海洋生物开始进化，多细胞生物刚刚开始出现。' },
  { year: '5亿6千万年前', file: '560Marect', name: 'Late Ediacaran', label: '晚期埃迪卡拉纪', explain: '海洋生物开始进化，多细胞生物刚刚开始出现。一次大规模灭绝即将发生。' },
  { year: '5亿4千万年前', file: '540Marect', name: 'Early Cambrian', label: '早寒武纪', explain: '一次大规模灭绝刚刚发生。随后，化石记录显示海洋中的动物生命迅速扩张，被称为“寒武纪大爆发”。动物开始演化出壳和外骨骼。' },
  { year: '5亿年前', file: '500Marect', name: 'Late Cambrian', label: '晚期寒武纪', explain: '经历了“寒武纪大爆发”后，海洋中的生命变得丰富多样，一些动物的形态显示与现代动物有祖先关系。' },
  { year: '4亿7千万年前', file: '470Marect', name: 'Ordovician Period', label: '奥陶纪', explain: '海洋生命丰富多样，第一个珊瑚礁出现。藻类是唯一的多细胞植物，在陆地上尚无复杂生命。无颌鱼类，即第一个脊椎动物，出现。' },
  { year: '4亿5千万年前', file: '450Marect', name: 'Late Ordovician', label: '晚期奥陶纪', explain: '海洋生命丰富多样，第一个珊瑚礁已经形成。藻类是唯一的多细胞植物，在陆地上尚无复杂生命。无颌鱼类，即第一个脊椎动物，出现。一次大规模灭绝即将发生。' },
  { year: '4亿3千万年前', file: '430Marect', name: 'Silurian Period', label: '志留纪', explain: '一次大规模灭绝已经发生，清除了近一半的海洋无脊椎动物物种。第一个陆地植物在海洋边缘开始出现。植物进化出导管系统，能够通过组织输送水分和养分。海洋生物变得更大更复杂，一些生物冒险离开珊瑚礁进入陆地。' },
  { year: '4亿年前', file: '400Marect', name: 'Devonian Period', label: '泥盆纪', explain: '随着植物的发展，陆地生命变得更加复杂。昆虫多样化，鱼类发展出结实的鳍，最终演化成四肢。第一个脊椎动物行走在陆地上。海洋和珊瑚礁中有各种各样的鱼类、鲨鱼、海蝎子和头足类动物。' },
  { year: '3亿7千万年前', file: '370Marect', name: 'Late Devonian', label: '晚期泥盆纪', explain: '随着植物的发展，陆地生命变得更加复杂。昆虫多样化，鱼类发展出结实的鳍，最终演化成四肢。第一个脊椎动物行走在陆地上。海洋和珊瑚礁中有各种各样的鱼类、鲨鱼、海蝎子和头足类动物。一次大规模灭绝即将发生，对海洋生物造成压力。' },
  { year: '3亿4千万年前', file: '340Marect', name: 'Carboniferous Period', label: '石炭纪', explain: '一次大规模灭绝伤害了海洋生物，但陆地生物适应了环境。植物正在发展根系，使它们能够长得更大并向内陆移动。树冠下的环境正在演化。随着植物在陆地上扩散，大气中的氧气增加。早期爬行动物正在演化。' },
  { year: '3亿年前', file: '300Marect', name: 'Late Carboniferous', label: '晚期石炭纪', explain: '植物发展出根系，使它们能够长得更大并向内陆移动。树冠下的环境正在演化。随着植物在陆地上扩散，大气中的氧气增加。早期爬行动物已经演化出来，巨型昆虫多样化。' },
  { year: '2亿8千万年前', file: '280Marect', name: 'Permian Period', label: '二叠纪', explain: '陆地合并形成了超大陆盘古。极地冰帽和沙漠等极端条件限制了植物的分布范围，但在植物生长的地方，两栖爬行动物和爬行动物的多样性不断增加。海洋中的鱼类和无脊椎动物生命丰富多样。' },
  { year: '2亿6千万年前', file: '260Marect', name: 'Late Permian', label: '晚期二叠纪', explain: '即将发生有史以来最大规模的灭绝事件，导致90%的物种灭绝。植物的灭绝减少了大型食草爬行动物的食物供应，并消失了昆虫的栖息地。' },
  { year: '2亿4千万年前', file: '240Marect', name: 'Early Triassic', label: '早三叠纪', explain: '由于许多陆地植物的灭绝，氧气水平显著降低。许多珊瑚灭绝，珊瑚礁需要数百万年才能重新形成。一些鸟类、哺乳类和恐龙的祖先幸存下来。' },
  { year: '2亿2千万年前', file: '220Marect', name: 'Middle Triassic', label: '中三叠纪', explain: '地球正在从二叠纪-三叠纪灭绝事件中恢复过来。小型恐龙开始出现。兽孔目动物和主龙目动物出现，同时出现了第一个有翅无脊椎动物。' },
  { year: '2亿年前', file: '200Marect', name: 'Late Triassic', label: '晚期三叠纪', explain: '即将发生一次灭绝事件，导致76%的陆地和海洋生物物种消失，并大大减少幸存种群。某些科，如翼龙、鳄鱼、哺乳动物和鱼类受到的影响较小。第一个真正的恐龙出现。' },
  { year: '1亿7千万年前', file: '170Marect', name: 'Jurassic Period', label: '侏罗纪', explain: '恐龙繁盛，早期哺乳动物和鸟类进化。海洋生物多样化，地球非常温暖。' },
  { year: '1亿5千万年前', file: '150Marect', name: 'Late Jurassic', label: '晚侏罗纪', explain: '最早的蜥蜴出现，原始的胎盘哺乳动物进化出来。恐龙主宰着陆地。大型海洋爬行动物栖息在海洋中，翼龙是主要的飞行脊椎动物。' },
  { year: '1亿2千万年前', file: '120Marect', name: 'Early Cretaceous', label: '早白垩纪', explain: '世界温暖，没有极地冰帽。大型爬行动物占主导地位，哺乳动物仍然很小。开花植物进化并在全球范围内传播。' },
  { year: '1亿50万年前', file: '105Marect', name: 'Cretaceous Period', label: '白垩纪', explain: '角龙和厚头龙进化。现代哺乳动物、鸟类和昆虫群体出现。' },
  { year: '9千万年前', file: '090Marect', name: 'Cretaceous Period', label: '白垩纪', explain: '角龙和厚头龙进化。现代哺乳动物、鸟类和昆虫群体出现。' },
  { year: '6千5百万年前', file: '065Marect', name: 'Late Cretaceous', label: '晚白垩纪', explain: '发生了一次大规模灭绝事件，导致恐龙、许多海洋爬行动物、所有飞行爬行动物以及许多海洋无脊椎动物和其他物种灭绝。科学家认为这次灭绝是由于墨西哥尤卡坦半岛现今所在地发生的一次小行星撞击引起的。' },
  { year: '5千万年前', file: '050Marect', name: 'Early Tertiary', label: '早第三纪', explain: '在杀死恐龙的小行星撞击后，幸存的鸟类、哺乳动物和爬行动物进化出了多样化。早期鲸类是从陆地哺乳动物进化而来的。' },
  { year: '3千5百万年前', file: '035Marect', name: 'Mid Tertiary', label: '中第三纪', explain: '哺乳动物已经从早期形态进化为现代形态。古猿和灵长类动物开始出现。陆地上的植被也发生了变化，逐渐出现了更多的草原和森林。' },
  { year: '2千万年前', file: '020Marect', name: 'Neocene Period', label: '晚第三纪', explain: '古猿和灵长类动物进一步演化，趋向于直立行走。早期人类的祖先开始出现。气候逐渐变冷，南极冰盖开始形成。' },
  { year: '当今', file: '000present', name: 'Present', label: '当代', explain: '我们正处于当代时期，面临着许多全球性的挑战，如气候变化、生物多样性丧失和可持续发展问题。人类正在努力寻找解决方案，以确保地球的未来可持续发展。' }
])

let bgImglayer = reactive(null)
async function action() {
  if (flag.value == null) {
    emit('update:sceneFlag', 'ancientEarth')

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(116.404269, 39.922793, 20000000)
    })

    flag.value = 1

    saveImageryLayers()
    const provider = await Cesium.SingleTileImageryProvider.fromUrl(`/img/earth/${historyList.value[flag.value].file}.jpg`)
    bgImglayer = viewer.imageryLayers.addImageryProvider(provider) // 加载背景底图
    bgImglayer.id = historyList.value[flag.value].label;

    (function roamingEvent() {
      if (flag.value !== null) {
        // 控制相机围绕 Z 轴旋转
        viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, Cesium.Math.toRadians(0.1))
        requestAnimationFrame(roamingEvent)
      }
    })()
  } else {
    reloadImageryLayers()
    flag.value = null
  }
}

const previous = async() => {
  flag.value = flag.value - 1

  // 移除当前的底图图层
  viewer.imageryLayers.remove(bgImglayer)

  // 准备新的地球底图图片，并设置新的名称

  const provider = await Cesium.SingleTileImageryProvider.fromUrl(`/img/earth/${historyList.value[flag.value].file}.jpg`)
  bgImglayer = viewer.imageryLayers.addImageryProvider(provider)
  bgImglayer.id = historyList.value[flag.value].label
}

const next = async() => {
  flag.value = flag.value + 1

  // 移除当前的底图图层
  viewer.imageryLayers.remove(bgImglayer)

  // 准备新的地球底图图片，并设置新的名称

  const provider = await Cesium.SingleTileImageryProvider.fromUrl(`/img/earth/${historyList.value[flag.value].file}.jpg`)
  bgImglayer = viewer.imageryLayers.addImageryProvider(provider)
  bgImglayer.id = historyList.value[flag.value].label
}

const skip = async(index) => {
  flag.value = index

  // 移除当前的底图图层
  viewer.imageryLayers.remove(bgImglayer)

  // 准备新的地球底图图片，并设置新的名称

  const provider = await Cesium.SingleTileImageryProvider.fromUrl(`/img/earth/${historyList.value[flag.value].file}.jpg`)
  bgImglayer = viewer.imageryLayers.addImageryProvider(provider)
  bgImglayer.id = historyList.value[flag.value].label
}

onMounted(() => {
})
watch(
  () => props.sceneFlag,
  (val) => {
    if (val === 'ancientEarth') {
      console.log('启动ancientEarth')
    } else {
      if (flag.value !== null) {
        reloadImageryLayers()
        flag.value = null
        console.log('关闭ancientEarth')
      }
    }
  }
)
</script>

<template>
  <el-card shadow="hover" @click="action" style="cursor: pointer;">
    <div style="text-align: center;">
      <svg t="1694146694920" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="13686" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20">
        <path
          d="M512 915.104c229.76 0 405.184-173.344 405.184-403.104S741.76 111.04 512 111.04C282.24 111.04 111.68 282.24 111.68 512S282.24 915.104 512 915.104z"
          fill="#FFFFFF" p-id="13687"></path>
        <path
          d="M512.032 928C282.24 928 96 741.728 96 512 96 282.304 282.24 96 512.032 96 741.76 96 928 282.304 928 512c0 229.728-186.24 416-415.968 416zM512 896c212.064 0 384-171.936 384-384S724.064 128 512 128 128 299.936 128 512s171.936 384 384 384z"
          fill="#5D6D7E" p-id="13688"></path>
        <path
          d="M265.472 619.04c43.456 7.456 93.696 2.816 93.696 2.816-46.912 83.84-35.68 152.448-25.76 184.32a373.664 373.664 0 0 1-119.04-99.648c-20.352-56.416-30.08-119.584-30.08-119.584s44.928 25.888 81.184 32.096z m472.608-72.896c54.368 98.432-4.16 111.424-54.464 208.416-55.008 106.016-65.312-11.584-65.312-11.584 10.944-219.904-89.792-237.312-119.68-243.104-29.952-5.76-54.432-8.704-54.432-46.336 0-37.6 47.648-50.624 65.312-46.272 17.664 4.256 40.8-59.392-21.824-92.608-62.528-33.344-84.288 27.424-97.856 81.024-13.632 53.568-38.144 39.04-43.616-23.168-5.376-62.24-20.32-14.432-32.64 11.584-12.192 26.048-81.632 57.856-87.008 34.752-3.392-14.496 1.696-47.232 6.016-69.6 62.688-97.824 168.192-161.984 287.776-161.984 129.792 0 242.72 75.68 302.688 187.648 6.08 54.72-20.096 103.936-52.32 113.376-39.488 11.584-32.64 57.856-32.64 57.856z"
          fill="#ACB4C0" p-id="13689"></path>
      </svg>
    </div>
    <div style="text-align: center;">{{ flag == null ? '查看板块变迁' : '关闭板块变迁' }}</div>
  </el-card>

  <Teleport to="body">
    <Transition>
      <el-card v-if="flag !== null" shadow="always"
        style="position: absolute; bottom: 16px; right: 16px; background-color: #f5f5f5; border-radius: 8px; padding: 16px;width:400px; max-width: 80vw;">

        <el-dropdown max-height="200" trigger="click">
          <div style="font-weight: bold; font-size: 18px; margin-bottom: 8px;cursor: pointer;">{{ historyList[flag].year }} <el-icon
              class="el-icon--right"><arrow-down /></el-icon></div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(item, index) in historyList" :key="item.label" @click="skip(index)">{{ item.label
              }} • {{ item.year }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <div style="font-size: 16px; margin-bottom: 8px;"><span style="color: blueviolet;">{{ historyList[flag].label
        }}</span> • {{ historyList[flag].name }}
        </div>
        <div style="font-size: 14px; margin-bottom: 12px;">{{ historyList[flag].explain }}</div>
        <div style="font-size: 12px; color: #999;">注：该文本数据由AI生成，仅供参考。</div>
        <div style="font-size: 12px; color: #999;">古代地理地图影像来源：<a href="http://www.scotese.com/"
            target="_blank">C.R.Scotese</a> </div>
        <el-divider style="margin: 12px 0 24px 0;" />
        <div style="display: flex;justify-content: space-between;">
          <el-button @click="previous" link v-if="historyList[flag - 1]"><el-icon>
              <ArrowLeftBold />
            </el-icon> {{ historyList[flag - 1].year }} </el-button>
          <div v-else></div>
          <el-button @click="next" link v-if="historyList[flag + 1]">
            {{ historyList[flag + 1].year }}
            <el-icon>
              <ArrowRightBold />
            </el-icon> </el-button>
        </div>
      </el-card>
    </Transition>
  </Teleport>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
