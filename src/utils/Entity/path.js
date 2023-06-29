/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-27 19:28:59
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\path.js
 * @Description: 实体类中路径的相关函数
 */
// TODO 未完成

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function add(x = 122, y = 23) {
  const position = Cesium.Cartesian3.fromDegrees(x, y);
  const options = {
    show: true,
    leadTime: 0,
    trailTime: 60,
    width: 10,
    resolution: 1,
    material: new Cesium.PolylineGlowMaterialProperty({
      glowPower: 0.3,
      taperPower: 0.3,
      color: Cesium.Color.PALEGOLDENROD,
    }),
  }
  const entity = viewer.entities.add({
    position,
    path: options
  });
  viewer.zoomTo(entity);
  return entity
}

export {
  add
}