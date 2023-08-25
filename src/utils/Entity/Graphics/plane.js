/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-27 19:29:52
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\plane.js
 * @Description: 实体类中平面的相关函数
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function add(x = 122, y = 23) {
  const position = Cesium.Cartesian3.fromDegrees(x, y)
  const options = {
    show: true,
    // 用于指定平面的法线和距离
    plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_X, 0.0),
    dimensions: new Cesium.Cartesian2(400000.0, 300000.0), // 指定平面的宽度和高度
    fill: true,
    material: Cesium.Color.BLUE,
    outline: false,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 1.0,
    shadows: Cesium.ShadowMode.DISABLED
    // type:DistanceDisplayCondition
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
  }
  const entity = viewer.entities.add({
    position,
    plane: options
  })
  viewer.zoomTo(entity)
  return entity
}

export {
  add
}
