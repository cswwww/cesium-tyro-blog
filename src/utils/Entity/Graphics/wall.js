/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-28 08:43:24
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\wall.js
 * @Description: 实体类中墙的相关函数
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function add() {
  const options = {
    show: true,

    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
      -115.0,
      44.0,
      200000.0,
      -90.0,
      44.0,
      200000.0,
    ]),

    // 用于墙底而不是地球表面的高度数组
    minimumHeights: [100000.0, 100000.0],
    // 用于墙顶的高度数组，而不是每个位置的高度
    // maximumHeights: [],

    granularity: Cesium.Math.RADIANS_PER_DEGREE, // 指定矩形上各点之间的角度距离
    fill: true,
    material: Cesium.Color.RED,

    outline: false,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 1.0,

    shadows: Cesium.ShadowMode.DISABLED,
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
  }
  const entity = viewer.entities.add({
    wall: options
  });
  viewer.zoomTo(entity);
  return entity
}

export {
  add
}