/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-28 08:43:45
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\polyline.js
 * @Description: 实体类中多线段的相关函数
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function add() {
  const options = {
    show: true,

    // 定义线条的 Cartesian3 位置的数组
    positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),

    width: 5,
    // 如果arcType不是ArcType.NONE，则指定每个纬度和经度之间的角距离
    // granularity: Cesium.Math.RADIANS_PER_DEGREE,

    material: Cesium.Color.RED,
    // 线低于地形时用于绘制折线的材质
    // depthFailMaterial: Cesium.Color.WHITE,

    // 折线段必须遵循的线型
    // arcType: Cesium.ArcType.GEODESIC,

    clampToGround: true, // 是否贴地

    shadows: Cesium.ShadowMode.DISABLED, // 折线是投射还是接收光源的阴影

    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),

    // 在地面上时将对地形，3D tiles还是对两者进行分类  type:ClassificationType  default:ClassificationType.BOTH
    // TERRAIN 将仅对地形进行分类;CESIUM_3D_TILE 将仅对3D Tiles进行分类;BOTH	将同时对Terrain和3D Tiles进行分类。
    classificationType: Cesium.ClassificationType.BOTH,

    // 指定用于订购地面几何形状的z索引。仅在多边形为常数且未指定高度或拉伸高度的情况下才有效  type:ConstantProperty
    // zIndex: 0,
  }
  const entity = viewer.entities.add({
    polyline: options
  });
  viewer.zoomTo(entity);
  return entity
}

export {
  add
}