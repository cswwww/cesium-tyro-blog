/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-27 18:38:53
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\corridor.js
 * @Description: 实体类中走廊的相关函数
 * https://cesium.com/learn/cesiumjs/ref-doc/CorridorGraphics.html#.ConstructorOptions
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function add(x = 122, y = 23) {
  const position = Cesium.Cartesian3.fromDegrees(x, y);
  const options = {
    show: true,
    // 指定定义走廊中心线的 Cartesian3 位置的数组  type: Cartesian3
    positions: Cesium.Cartesian3.fromDegreesArray([
      -80.0,
      40.0,
      -85.0,
      40.0,
      -85.0,
      35.0,
    ]),
    width: 200000.0,
    height: 200000.0,
    heightReference: Cesium.HeightReference.NONE,
    extrudedHeight: 100000.0, // 指定corridor的拉伸面相对于椭球曲面的高度
    extrudedHeightReference: Cesium.HeightReference.NONE,

    // 拐角的样式  type:CornerType  default:CornerType.ROUNDED
    // ROUNDED	角有光滑的边缘；MITERED	拐角点是相邻边的交点；BEVELED	角被修剪
    cornerType: Cesium.CornerType.ROUNDED,
    granularity: Cesium.Math.RADIANS_PER_DEGREE, // 每个纬度和经度之间的距离
    fill: true,
    // 材质  type:MaterialProperty|Color  default:Color.WHITE
    material: Cesium.Color.BLUE.withAlpha(0.5),
    outline: true, // height or extrudedHeight must be set for outlines to display
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 1.0,
    shadows: Cesium.ShadowMode.DISABLED,
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
    // 走廊在地面上时将对地形，3D tiles还是对两者进行分类  type:ClassificationType  default:ClassificationType.BOTH
    // TERRAIN 将仅对地形进行分类;CESIUM_3D_TILE 将仅对3D Tiles进行分类;BOTH	将同时对Terrain和3D Tiles进行分类。
    classificationType: Cesium.ClassificationType.BOTH,
    // zIndex: 0 // 用于排序。只有在未定义高度和拉伸高度以及道路是静态的情况下才有效果。
  }
  const entity = viewer.entities.add({
    position,
    corridor: options
  });
  viewer.zoomTo(entity);
  return entity
}

export {
  add
}