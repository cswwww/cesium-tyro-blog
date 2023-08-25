/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-21 15:41:45
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\rectangle.js
 * @Description: 实体类中点的相关函数
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function add() {
  const options = {
    show: true,

    coordinates: Cesium.Rectangle.fromDegrees(-110.0, 20.0, -80.0, 25.0),

    // height: 0, // 矩形相对于椭球面的高度
    // heightReference: Cesium.HeightReference.NONE,

    // extrudedHeight: 0, // 矩形的拉伸面相对于椭球面的高度
    // extrudedHeightReference: Cesium.HeightReference.NONE,

    rotation: 0.0, // 矩形从北方向顺时针方向的旋转
    stRotation: 0.0, // 矩形纹理从北方逆时针旋转
    granularity: Cesium.Math.RADIANS_PER_DEGREE, // 指定矩形上各点之间的角度距离
    fill: true,
    material: Cesium.Color.RED.withAlpha(0.5),

    outline: false,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 1.0,

    shadows: Cesium.ShadowMode.DISABLED,
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
    // 在地面上时将对地形，3D tiles还是对两者进行分类  type:ClassificationType  default:ClassificationType.BOTH
    // TERRAIN 将仅对地形进行分类;CESIUM_3D_TILE 将仅对3D Tiles进行分类;BOTH	将同时对Terrain和3D Tiles进行分类。
    classificationType: Cesium.ClassificationType.BOTH,
    // 指定用于订购地面几何形状的z索引。仅在多边形为常数且未指定高度或拉伸高度的情况下才有效  type:ConstantProperty
    zIndex: 0
  }
  const entity = viewer.entities.add({
    rectangle: options
  })
  viewer.zoomTo(entity)
  return entity
}

export {
  add
}
