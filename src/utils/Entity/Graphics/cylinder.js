/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-27 18:40:01
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\cylinder.js
 * @Description: 实体类中圆柱、圆锥的相关函数
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function add(x = 122, y = 23) {
  const position = Cesium.Cartesian3.fromDegrees(x, y)
  const options = {
    // show: true,
    length: 400000.0, // 圆柱体长度
    topRadius: 200000.0, // 圆柱体顶部半径
    bottomRadius: 200000.0, // 圆柱体底部半径
    heightReference: Cesium.HeightReference.NONE,
    fill: true,
    material: Cesium.Color.GREEN.withAlpha(0.5),
    outline: true,
    outlineColor: Cesium.Color.DARK_GREEN,
    outlineWidth: 1.0,
    numberOfVerticalLines: 16, // 沿轮廓的周长绘制的垂直线的数量
    shadows: Cesium.ShadowMode.DISABLED,
    slices: 128 // 圆柱周围的边缘数量
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
  }
  const entity = viewer.entities.add({
    position,
    cylinder: options
  })
  viewer.zoomTo(entity)
  return entity
}

export {
  add
}
