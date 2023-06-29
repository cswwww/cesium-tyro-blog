/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-28 08:50:27
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\polygon.js
 * @Description: 实体类中多边形的相关函数
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function add() {
  const options ={
    show: true,
    // 指定PolygonHierarchy
    hierarchy: Cesium.Cartesian3.fromDegreesArray([
      -115.0,
      37.0,
      -115.0,
      32.0,
      -107.0,
      33.0,
      -102.0,
      31.0,
      -102.0,
      35.0,
    ]),
    height: 0, // 多边形相对于椭球面的高度
    heightReference: Cesium.HeightReference.NONE,
    // extrudedHeight: 0, // 多边形的凸出面相对于椭球面的高度
    // extrudedHeightReference: Cesium.HeightReference.NONE,
    stRotation: 0.0, // 多边形纹理从北方逆时针旋转
    granularity: Cesium.Math.RADIANS_PER_DEGREE, // 每个纬度和经度点之间的角距离
    fill: true,
    material: Cesium.Color.RED, // Cesium.Color.fromRandom({ alpha: 1.0 })
    outline: false,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 1.0,  // 有些电脑outlineWidth为大于1的值时，将不起作用，参考：https://blog.csdn.net/u014556081/article/details/114305047
    perPositionHeight: false, // 是否使用每个位置的高度

    closeTop: true, // 如果为false，则将挤出的多边形顶部留空
    closeBottom: true, // 如果为false，则将挤出的多边形的底部保留为开放状态

    // 多边形边缘必须遵循的线型    type:ArcType 定义连接顶点应采用的路径。
    // NONE 与椭圆表面不符的直线;GEODESIC 遵循测地路径;RHUMB	遵循大黄蜂或恶魔般的道路。
    arcType: Cesium.ArcType.GEODESIC,
    shadows: Cesium.ShadowMode.DISABLED,
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
    // 在地面上时将对地形，3D tiles还是对两者进行分类  type:ClassificationType  default:ClassificationType.BOTH
    // TERRAIN 将仅对地形进行分类;CESIUM_3D_TILE 将仅对3D Tiles进行分类;BOTH	将同时对Terrain和3D Tiles进行分类。
    classificationType: Cesium.ClassificationType.BOTH,
    // 指定用于订购地面几何形状的z索引。仅在多边形为常数且未指定高度或拉伸高度的情况下才有效  type:ConstantProperty
    zIndex: 0,
  }
  const entity = viewer.entities.add({
    polygon: options
  });
  viewer.zoomTo(entity);
  return entity
}

// 修改矢量数据entities的属性、样式
function Polygon(dataSource) {
  const entities = dataSource.entities.values // 获取集合中实体实例的数组
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];

    if (!entity.polygon) {
      return
    }
    entity.polygon.outline = false
    entity.polygon.outlineWidth = 3 // 有些电脑outlineWidth为大于1的值时，将不起作用，参考：https://blog.csdn.net/u014556081/article/details/114305047
    entity.polygon.outlineColor = Cesium.Color.RED

    entity.polygon.fill = true
    entity.polygon.material = Cesium.Color.fromRandom({ alpha: 1.0 })
    entity.polygon.extrudedHeight = Math.floor(Math.random() * 20000 + 100) // 设置拔高100~20100的随机数，单位是米

    entity.polyline = {
      positions: entity.polygon.hierarchy._value.positions,
      width: entity.polygon.outlineWidth,
      material: Cesium.Color.YELLOW
    }
  }
  viewer.zoomTo(dataSource)
}

export {
  add,
  Polygon
}