/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-10 17:41:55
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\Graphics\box.js
 * @Description: 实体类中盒子的相关函数
 * https://cesium.com/learn/cesiumjs/ref-doc/BoxGraphics.html#.ConstructorOptions 
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function add(x = 122, y = 23) {
  const position = Cesium.Cartesian3.fromDegrees(x, y);
  const options = {
    show: true,
    dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0), // Cartesian3类型，用于指定box的长度，宽度和高度
    // 指定距实体位置的高度是相对于什么的高度。 default: HeightReference.NONE
    // NONE	位置绝对；CLAMP_TO_GROUND	位置固定在地形上；RELATIVE_TO_GROUND 位置高度是指地形上方的高度。
    heightReference: Cesium.HeightReference.NONE,
    fill: true, // 指定是否使用所提供的材质填充框
    // MaterialProperty|Color  default:Color.WHITE
    material: Cesium.Color.RED.withAlpha(0.5),
    outline: true,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 1.0,

    // type:ShadowMode  default:ShadowMode.DISABLED
    // DISABLED	对象不投射或接收阴影；ENABLED	对象投射并接收阴影；CAST_ONLY	对象仅投射阴影；RECEIVE_ONLY 该对象仅接收阴影。
    // viewer.shadows = true 时才生效
    shadows: Cesium.ShadowMode.DISABLED, // Cesium.ShadowMode.ENABLED
    // 设置1000米和2000米之间可见  type:DistanceDisplayCondition
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
  }
  const entity = viewer.entities.add({
    position,
    box: options
  });
  viewer.zoomTo(entity);
  return entity
}

export {
  add
}