import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

import FlowPictureMaterialProperty from '@/utils/Material/FlowPictureMaterialProperty.js'

const position = Cesium.Cartesian3.fromDegrees(12, 34)

const material = new FlowPictureMaterialProperty({
  color: Cesium.Color.WHITE, // new Cesium.Color(1.0, 1.0, 1.0, 1.0),
  image: '/src/assets/images/redBar.png',
  duration: 1500
})

// const material = Cesium.Color.RED

export default function add() {
  const box = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(12, 38),
    box: {
      show: true,
      dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0), // Cartesian3类型，用于指定box的长度，宽度和高度
      // 指定距实体位置的高度是相对于什么的高度。 default: HeightReference.NONE
      // NONE	位置绝对；CLAMP_TO_GROUND	位置固定在地形上；RELATIVE_TO_GROUND 位置高度是指地形上方的高度。
      heightReference: Cesium.HeightReference.NONE,
      fill: true, // 指定是否使用所提供的材质填充框
      material,
      outline: true,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 1.0,

      // type:ShadowMode  default:ShadowMode.DISABLED
      // DISABLED	对象不投射或接收阴影；ENABLED	对象投射并接收阴影；CAST_ONLY	对象仅投射阴影；RECEIVE_ONLY 该对象仅接收阴影。
      // viewer.shadows = true 时才生效
      shadows: Cesium.ShadowMode.DISABLED // Cesium.ShadowMode.ENABLED
    }
  })

  const cylinder = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(16, 34),
    cylinder: {
      // show: true,
      length: 400000.0, // 圆柱体长度
      topRadius: 200000.0, // 圆柱体顶部半径
      bottomRadius: 200000.0, // 圆柱体底部半径
      heightReference: Cesium.HeightReference.NONE,
      fill: true,
      material,
      outline: true,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 1.0,
      numberOfVerticalLines: 16, // 沿轮廓的周长绘制的垂直线的数量
      shadows: Cesium.ShadowMode.DISABLED,
      slices: 128 // 圆柱周围的边缘数量
    }
  })

  const ellipse = viewer.entities.add({
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
      material,
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

  const ellipsoid = viewer.entities.add({
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
      material,
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

  const plane = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(11, 34),
    plane: {
      show: true,
      // 用于指定平面的法线和距离
      plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0.0),
      dimensions: new Cesium.Cartesian2(400000.0, 300000.0), // 指定平面的宽度和高度
      fill: true,
      material,
      outline: true,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 1.0,
      shadows: Cesium.ShadowMode.DISABLED
    }
  })

  const polygon = viewer.entities.add({
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
      material, // Cesium.Color.fromRandom({ alpha: 1.0 })
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

  const polyline = viewer.entities.add({
    polyline: {
      show: true,
      positions: Cesium.Cartesian3.fromDegreesArray([17, 31, 23, 31]),
      width: 8,
      // 如果arcType不是ArcType.NONE，则指定每个纬度和经度之间的角距离
      // granularity: Cesium.Math.RADIANS_PER_DEGREE,
      material,
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
  const polylineVolume = viewer.entities.add({
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
      material,
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

  const wall = viewer.entities.add({
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
      material,

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

  const best = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(50, 50),
    ellipse: {
      semiMajorAxis: 150000.0, // 长半轴距离
      semiMinorAxis: 150000.0, // 短半轴距离
      material: new FlowPictureMaterialProperty({
        color: Cesium.Color.WHITE, // new Cesium.Color(1.0, 1.0, 1.0, 1.0),
        image: '/src/assets/images/redBar.png',
        duration: 1500
      })
    }
  })
  viewer.zoomTo(best)
}
