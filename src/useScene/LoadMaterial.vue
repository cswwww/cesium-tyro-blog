<!--
 * @Date: 2023-06-06 16:17:18
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-09-12 12:29:27
 * @FilePath: \cesium-tyro-blog\src\useScene\LoadMaterial.vue
 * @Description: 材质预览组件
-->
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

const flag = ref(null)
const materialPreview = new Cesium.CustomDataSource('materialPreviewCollection')

import FlowPictureMaterialProperty from '@/utils/Material/FlowPictureMaterialProperty.js'
import EllipsoidFadeMaterialProperty from '@/utils/Material/EllipsoidFadeMaterialProperty.js'
import LineFlickerMaterialProperty from '@/utils/Material/LineFlickerMaterialProperty.js'
import LineFlowMaterialProperty from '@/utils/Material/LineFlowMaterialProperty.js'
import RadarScanMaterialProperty from '@/utils/Material/RadarScanMaterialProperty.js'
import SpritelineMaterialProperty from '@/utils/Material/SpritelineMaterialProperty.js'
import WallFlowMaterialProperty from '@/utils/Material/WallFlowMaterialProperty.js'

const currentMaterial = ref(null)
const materialList = reactive({
  FlowPictureMaterialProperty: new FlowPictureMaterialProperty({
    color: Cesium.Color.WHITE, // new Cesium.Color(1.0, 1.0, 1.0, 1.0),
    image: '/src/assets/images/redBar.png',
    duration: 1500
  }),
  EllipsoidFadeMaterialProperty: new EllipsoidFadeMaterialProperty({
    color: new Cesium.Color(1.0, 1.0, 0.0, 0.8),
    duration: 3000
  }),
  LineFlickerMaterialProperty: new LineFlickerMaterialProperty({
    color: Cesium.Color.YELLOW,
    speed: 20 * Math.random() // 设置随机变化速度
  }),
  LineFlowMaterialProperty: new LineFlowMaterialProperty({
    color: new Cesium.Color(1.0, 1.0, 0.0, 0.8),
    speed: 15 * Math.random(),
    percent: 0.1,
    gradient: 0.01
  }),
  RadarScanMaterialProperty: new RadarScanMaterialProperty({
    color: new Cesium.Color(1.0, 1.0, 0.0, 0.2),
    speed: 20.0
  }),
  SpritelineMaterialProperty: new SpritelineMaterialProperty({
    duration: 1000,
    image: '/src/assets/images/spriteline.png'
  }),
  WallFlowMaterialProperty: new WallFlowMaterialProperty({
    color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
    speed: 10.0,
    image: '/src/assets/images/spriteline.png'
  }),
  ColorMaterialProperty: new Cesium.ColorMaterialProperty(Cesium.Color.BLUE.withAlpha(0.5)),
  ImageMaterialProperty: new Cesium.ImageMaterialProperty({
    image: '/src/assets/images/nyan-cat.jpg',
    repeat: new Cesium.Cartesian2(4, 4),
    color: new Cesium.Color(1.0, 0.0, 0.0, 1.0)
  }),
  CheckerboardMaterialProperty: new Cesium.CheckerboardMaterialProperty({
    evenColor: Cesium.Color.WHITE,
    oddColor: Cesium.Color.BLACK,
    repeat: new Cesium.Cartesian2(4, 4)
  }),
  StripeMaterialProperty: new Cesium.StripeMaterialProperty({
    orientation: Cesium.StripeOrientation.VERTICAL,
    evenColor: Cesium.Color.WHITE,
    oddColor: Cesium.Color.BLACK,
    repeat: 16
  }),
  GridMaterialProperty: new Cesium.GridMaterialProperty({
    color: Cesium.Color.YELLOW,
    cellAlpha: 0.5,
    lineCount: new Cesium.Cartesian2(8, 8),
    lineThickness: new Cesium.Cartesian2(2.0, 2.0),
    lineOffset: new Cesium.Cartesian2(0.0, 0.0)
  }),
  PolylineGlowMaterialProperty: new Cesium.PolylineGlowMaterialProperty({
    glowPower: 0.8,
    taperPower: 0.5,
    color: Cesium.Color.CORNFLOWERBLUE
  }),
  // PolylineOutlineMaterialProperty: new Cesium.PolylineOutlineMaterialProperty({
  //   color: Cesium.Color.ORANGE,
  //   outlineWidth: 5,
  //   outlineColor: Cesium.Color.BLACK
  // }),
  PolylineArrowMaterialProperty: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.PURPLE)
  // PolylineDashMaterialProperty: new Cesium.PolylineDashMaterialProperty({
  //   color: Cesium.Color.CYAN
  // })
})

let box,
  cylinder,
  ellipse,
  ellipsoid,
  plane,
  polygon,
  polyline,
  polylineVolume,
  wall

const addEntities = (newMaterial) => {
  if (newMaterial) {
    box.box.material = materialList[newMaterial]
    cylinder.cylinder.material = materialList[newMaterial]
    ellipse.ellipse.material = materialList[newMaterial]
    ellipsoid.ellipsoid.material = materialList[newMaterial]
    plane.plane.material = materialList[newMaterial]
    polygon.polygon.material = materialList[newMaterial]
    polyline.polyline.material = materialList[newMaterial]
    polylineVolume.polylineVolume.material = materialList[newMaterial]
    wall.wall.material = materialList[newMaterial]

    return
  }

  box = materialPreview.entities.add({
    position: Cesium.Cartesian3.fromDegrees(12, 38),
    box: {
      show: true,
      dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0), // Cartesian3类型，用于指定box的长度，宽度和高度
      // 指定距实体位置的高度是相对于什么的高度。 default: HeightReference.NONE
      // NONE	位置绝对；CLAMP_TO_GROUND	位置固定在地形上；RELATIVE_TO_GROUND 位置高度是指地形上方的高度。
      heightReference: Cesium.HeightReference.NONE,
      fill: true, // 指定是否使用所提供的材质填充框
      material: materialList[currentMaterial.value],
      outline: true,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 1.0,

      // type:ShadowMode  default:ShadowMode.DISABLED
      // DISABLED	对象不投射或接收阴影；ENABLED	对象投射并接收阴影；CAST_ONLY	对象仅投射阴影；RECEIVE_ONLY 该对象仅接收阴影。
      // viewer.shadows = true 时才生效
      shadows: Cesium.ShadowMode.DISABLED // Cesium.ShadowMode.ENABLED
    }
  })

  cylinder = materialPreview.entities.add({
    position: Cesium.Cartesian3.fromDegrees(16, 34),
    cylinder: {
      // show: true,
      length: 400000.0, // 圆柱体长度
      topRadius: 200000.0, // 圆柱体顶部半径
      bottomRadius: 200000.0, // 圆柱体底部半径
      heightReference: Cesium.HeightReference.NONE,
      fill: true,
      material: materialList[currentMaterial.value],
      outline: true,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 1.0,
      numberOfVerticalLines: 16, // 沿轮廓的周长绘制的垂直线的数量
      shadows: Cesium.ShadowMode.DISABLED,
      slices: 128 // 圆柱周围的边缘数量
    }
  })

  ellipse = materialPreview.entities.add({
    position: Cesium.Cartesian3.fromDegrees(24, 34),
    ellipse: {
      show: true,
      semiMajorAxis: 300000.0, // 长半轴距离
      semiMinorAxis: 150000.0, // 短半轴距离

      height: 20000.0,
      heightReference: Cesium.HeightReference.NONE,
      extrudedHeight: 20000.0,
      extrudedHeightReference: Cesium.HeightReference.NONE,

      // rotation: Cesium.Math.toRadians(45), // 从北方逆时针旋转
      stRotation: 0.0, // 纹理从北方逆时针旋转
      granularity: Cesium.Math.RADIANS_PER_DEGREE, // 椭圆上各点之间的角距离
      material: materialList[currentMaterial.value],
      fill: true,
      outline: true,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 1.0,
      numberOfVerticalLines: 16, // 沿轮廓的周长绘制的垂直线的数量
      shadows: Cesium.ShadowMode.DISABLED,
      // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      //   1.0e3,
      //   2.0e3
      // ),

      // 在地面上时将对地形，3D tiles还是对两者进行分类  type:ClassificationType  default:ClassificationType.BOTH
      // TERRAIN 将仅对地形进行分类;CESIUM_3D_TILE 将仅对3D瓷砖进行分类;BOTH	将同时对Terrain和3D Tile进行分类。
      classificationType: Cesium.ClassificationType.BOTH
    }
  })

  ellipsoid = materialPreview.entities.add({
    position: Cesium.Cartesian3.fromDegrees(20, 38, 150000),
    ellipsoid: {
      show: true,
      radii: new Cesium.Cartesian3(200000.0, 200000.0, 300000.0), // 椭球半径
      // innerRadii: new Cesium.Cartesian3(0.0, 0.0, 0.0), // 椭球内部半径
      minimumClock: 0.0, // 最小时钟角度
      maximumClock: 2 * Math.PI, // 最大时钟角度
      minimumCone: 0.0, // 最小圆锥角
      maximumCone: Math.PI, // 最大圆锥角
      heightReference: 150000, //  Cesium.HeightReference.NONE
      fill: true,
      material: materialList[currentMaterial.value],
      outline: false,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 1.0,

      stackPartitions: 64, // 延纬度线切割的次数
      slicePartitions: 64, // 延经度线切割的次数
      subdivisions: 128, // 每个轮廓环的样本数，确定曲率的粒度

      shadows: Cesium.ShadowMode.DISABLED
      // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      //   1.0e3,
      //   2.0e3
      // ),
    }
  })

  plane = materialPreview.entities.add({
    position: Cesium.Cartesian3.fromDegrees(11, 34),
    plane: {
      show: true,
      // 用于指定平面的法线和距离
      plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0.0),
      dimensions: new Cesium.Cartesian2(400000.0, 300000.0), // 指定平面的宽度和高度
      fill: true,
      material: materialList[currentMaterial.value],
      outline: true,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 1.0,
      shadows: Cesium.ShadowMode.DISABLED
    }
  })

  polygon = materialPreview.entities.add({
    polygon: {
      show: true,
      // 指定PolygonHierarchy
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        12.0, 30.0,
        12.0, 28.0,
        15.0, 28.0,
        15.0, 30.0
      ]),
      height: 1000, // 多边形相对于椭球面的高度
      // heightReference: Cesium.HeightReference.NONE,
      extrudedHeight: 1000, // 多边形的凸出面相对于椭球面的高度
      // extrudedHeightReference: Cesium.HeightReference.NONE,
      // stRotation: 0.0, // 多边形纹理从北方逆时针旋转
      // granularity: Cesium.Math.RADIANS_PER_DEGREE, // 每个纬度和经度点之间的角距离
      fill: true,
      material: materialList[currentMaterial.value], // Cesium.Color.fromRandom({ alpha: 1.0 })
      outline: true,
      outlineColor: Cesium.Color.BLACK
      // perPositionHeight: false, // 是否使用每个位置的高度

      // closeTop: true, // 如果为false，则将挤出的多边形顶部留空
      // closeBottom: true, // 如果为false，则将挤出的多边形的底部保留为开放状态

      // 多边形边缘必须遵循的线型    type:ArcType 定义连接顶点应采用的路径。
      // arcType: Cesium.ArcType.GEODESIC,
      // shadows: Cesium.ShadowMode.DISABLED,
      // classificationType: Cesium.ClassificationType.BOTH,
      // zIndex: 0,
    }
  })

  polyline = materialPreview.entities.add({
    polyline: {
      show: true,
      positions: Cesium.Cartesian3.fromDegreesArray([17, 31, 23, 31]),
      width: 8,
      // 如果arcType不是ArcType.NONE，则指定每个纬度和经度之间的角距离
      // granularity: Cesium.Math.RADIANS_PER_DEGREE,
      material: materialList[currentMaterial.value],
      // 线低于地形时用于绘制折线的材质
      // depthFailMaterial: Cesium.Color.WHITE,

      // 折线段必须遵循的线型
      // arcType: Cesium.ArcType.GEODESIC,
      outlineColor: Cesium.Color.BLACK,

      clampToGround: true, // 是否贴地

      // shadows: Cesium.ShadowMode.DISABLED, // 折线是投射还是接收光源的阴影
      // 在地面上时将对地形，3D tiles还是对两者进行分类  type:ClassificationType  default:ClassificationType.BOTH
      // TERRAIN 将仅对地形进行分类;CESIUM_3D_TILE 将仅对3D Tiles进行分类;BOTH	将同时对Terrain和3D Tiles进行分类。
      classificationType: Cesium.ClassificationType.BOTH
    }
  })

  function computeCircle(radius) {
    var positions = []
    for (var i = 0; i < 360; i++) {
      var radians = Cesium.Math.toRadians(i)
      positions.push(
        new Cesium.Cartesian2(
          radius * Math.cos(radians),
          radius * Math.sin(radians)
        )
      )
    }
    return positions
  }
  polylineVolume = materialPreview.entities.add({
    polylineVolume: {
      show: true,

      // 定义线带的 Cartesian3 位置的数组
      positions: Cesium.Cartesian3.fromDegreesArray([
        17, 28, 23, 28
      ]),

      // 指定 Cartesian2 位置的数组，这些位置定义了要拉伸的形状
      shape: computeCircle(30000.0),

      // 拐角的样式  type:CornerType
      // ROUNDED	拐角有光滑的边缘;MITERED 拐角点是相邻边的交点;BEVELED	拐角被修剪。
      cornerType: Cesium.CornerType.ROUNDED,

      // 如果arcType不是ArcType.NONE，则指定每个纬度和经度之间的角距离
      // granularity: Cesium.Math.RADIANS_PER_DEGREE,
      fill: true,
      material: materialList[currentMaterial.value],
      outline: false,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 1.0,

      shadows: Cesium.ShadowMode.DISABLED // 体积是投射还是接收光源的阴影

      // type:DistanceDisplayCondition
      // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      //   1.0e3,
      //   2.0e3
      // ),
    }
  })

  wall = materialPreview.entities.add({
    wall: {
      show: true,

      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        25.0,
        38.0,
        200000.0,
        29.0,
        38.0,
        200000.0,
        29.0,
        41.0,
        200000.0
      ]),

      // 用于墙底而不是地球表面的高度数组
      minimumHeights: [100000.0, 100000.0, 100000.0],
      // 用于墙顶的高度数组，而不是每个位置的高度
      // maximumHeights: [],

      granularity: Cesium.Math.RADIANS_PER_DEGREE, // 指定矩形上各点之间的角度距离
      fill: true,
      material: materialList[currentMaterial.value],

      outline: true,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 1.0,

      shadows: Cesium.ShadowMode.DISABLED
      // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      //   1.0e3,
      //   2.0e3
      // ),
    }
  })

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(16, 34, 2800000)
  })
}

const changeMaterial = () => {
  // currentMaterial.value = materialList[currentMaterial.value]
  console.log('currentMaterial.value: ', currentMaterial.value)
  addEntities(currentMaterial.value)
}

const actionScene = () => {
  if (!viewer.dataSources.contains(materialPreview)) {
    viewer.dataSources.add(materialPreview)
  }
  addEntities()
  flag.value = true
}
const closeScene = () => {
  materialPreview.entities.removeAll()
  flag.value = null
}
onMounted(() => {
  currentMaterial.value = Object.keys(materialList)[0]
})

defineExpose({
  actionScene,
  closeScene
})
</script>

<template>
  <el-card shadow="hover" style="cursor: pointer;">
    <div style="text-align: center;">
      <svg t="1694443688293" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="13680" width="20" height="20">
        <path d="M512 112L928 320v384l-416 208L96 704V320z" fill="#C49F74" p-id="13681"></path>
        <path d="M512 112l416 192v320L512 832 96 624v-320z" fill="#D3BB9E" p-id="13682"></path>
        <path d="M512 112l416 192v192L512 704 96 496v-192z" fill="#FFDE9C" p-id="13683"></path>
        <path d="M512 112l416 192v64L512 576 96 368v-64z" fill="#30AD98" p-id="13684"></path>
        <path d="M512 118.816L928 304 512 512 96 304z" fill="#32BAA2" p-id="13685"></path>
        <path
          d="M512 96l416 208v416L512 928 96 720v-416L512 96z m0 35.776l-384 192v376.448l384 192 384-192V323.776l-384-192z"
          fill="#5D6D7E" p-id="13686"></path>
      </svg>
    </div>
    <div style="text-align: center;">{{ !flag ? '开启材质预览' : '关闭材质预览' }}</div>
  </el-card>

  <Teleport to="body">
    <Transition>
      <el-card v-if="flag !== null" shadow="always"
        style="position: absolute; bottom: 16px; right: 16px; background-color: #f5f5f5; border-radius: 8px; width:400px; max-width: 80vw;">
        <div style="font-weight: bold; font-size: 18px;">MaterialProperty</div>
        <div style="max-height: 30vh;overflow: auto;">
          <el-radio-group v-model="currentMaterial" @change="changeMaterial">
            <el-radio v-for="label in Object.keys(materialList)" :key="label" :label="label" size="large">{{ label
            }}</el-radio>
          </el-radio-group>
        </div>
      </el-card>
    </Transition>
  </Teleport>
</template>
