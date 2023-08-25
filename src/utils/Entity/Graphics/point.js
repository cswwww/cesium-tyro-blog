/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-25 17:32:59
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\Graphics\point.js
 * @Description: 实体类中点的相关函数
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

/**
 * Adds a point entity to the viewer at the specified position.
 *
 * @param {number} x - The x-coordinate of the position in degrees.
 * @param {number} y - The y-coordinate of the position in degrees.
 * @return {Entity} The newly created point entity.
 */
function add(x = 122, y = 23) {
  const position = Cesium.Cartesian3.fromDegrees(x, y)
  const options = {
    show: true,
    pixelSize: 10, // 像素大小，默认: 1
    heightReference: Cesium.HeightReference.NONE, // 表示相对于地形的位置
    color: Cesium.Color.SKYBLUE, // 默认: 白
    outlineColor: Cesium.Color.BLACK, // 边框颜色,默认: 黑
    outlineWidth: 3, // 边框宽度,默认: 0
    // scaleByDistance: new Cesium.NearFarScalar(1.0e3, 10.0, 2.0e3, 1.0), // 随着相机的距离改变大小
    // translucencyByDistance: new Cesium.NearFarScalar(1.0e3,1.0,2.0e3,0.1), // 随着相机的距离改变透明度
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0,2.0e3), // 在指定距离区间内可见
    // 获取或设置与相机的距离，在深度处禁用深度测试
    // 设置为零时，将始终应用深度测试。设置为Number.POSITIVE_INFINITY时，永远不会应用深度测试。
    disableDepthTestDistance: Number.POSITIVE_INFINITY
  }
  const entity = viewer.entities.add({
    position,
    point: options
  })
  viewer.zoomTo(entity)
  return entity
}

export {
  add
}
