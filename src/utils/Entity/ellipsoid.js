/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-27 18:43:45
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\ellipsoid.js
 * @Description: 实体类中椭球体的相关函数
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function add(x = 122, y = 23) {
  const position = Cesium.Cartesian3.fromDegrees(x, y);
  const options = {
    show: true,
    radii: new Cesium.Cartesian3(200000.0, 200000.0, 300000.0), // 椭球半径
    // innerRadii: new Cesium.Cartesian3(0.0, 0.0, 0.0), // 椭球内部半径
    minimumClock: 0.0, // 最小时钟角度
    maximumClock: 2 * Math.PI, // 最大时钟角度
    minimumCone: 0.0, // 最小圆锥角
    maximumCone: Math.PI, // 最大圆锥角
    heightReference: Cesium.HeightReference.NONE,
    fill: true,
    material: Cesium.Color.BLUE.withAlpha(0.5),
    outline: true,
    outlineColor: Cesium.Color.YELLOW,
    outlineWidth: 1.0,

    stackPartitions: 64, // 延纬度线切割的次数
    slicePartitions: 64, // 延经度线切割的次数
    subdivisions: 128, // 每个轮廓环的样本数，确定曲率的粒度

    shadows: Cesium.ShadowMode.DISABLED,
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
  }
  const entity = viewer.entities.add({
    position,
    ellipsoid: options
  });
  viewer.zoomTo(entity);
  return entity
}

export {
  add
}