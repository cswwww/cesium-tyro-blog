/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-28 08:22:04
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\polylineVolume.js
 * @Description: 实体类中多线段柱体的相关函数
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function add() {
  function computeCircle(radius) {
    var positions = [];
    for (var i = 0; i < 360; i++) {
      var radians = Cesium.Math.toRadians(i);
      positions.push(
        new Cesium.Cartesian2(
          radius * Math.cos(radians),
          radius * Math.sin(radians)
        )
      );
    }
    return positions;
  }
  const options = {
    show: true,

    // 定义线带的 Cartesian3 位置的数组
    positions: Cesium.Cartesian3.fromDegreesArray([
      -85.0,
      32.0,
      -85.0,
      36.0,
      -89.0,
      36.0,
    ]),

    // 指定 Cartesian2 位置的数组，这些位置定义了要拉伸的形状
    shape: computeCircle(60000.0),

    // 拐角的样式  type:CornerType
    // ROUNDED	拐角有光滑的边缘;MITERED 拐角点是相邻边的交点;BEVELED	拐角被修剪。
    cornerType: Cesium.CornerType.ROUNDED,

    // 如果arcType不是ArcType.NONE，则指定每个纬度和经度之间的角距离
    // granularity: Cesium.Math.RADIANS_PER_DEGREE,

    fill: true,

    material: Cesium.Color.RED,

    outline: false,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 1.0,

    shadows: Cesium.ShadowMode.DISABLED, // 体积是投射还是接收光源的阴影

    // type:DistanceDisplayCondition
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
  }
  const entity = viewer.entities.add({
    polylineVolume: options
  });
  viewer.zoomTo(entity);
  return entity
}

export {
  add
}