/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-27 19:21:22
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\tileset.js
 * @Description: 实体类中3D Tiles瓦片集的相关函数
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function add(x = 122, y = 23) {
  const position = Cesium.Cartesian3.fromDegrees(x, y);
  const options = {
    show: true,
    uri: '/src/assets/model/Tileset/示例建筑/tileset.json',
    // maximumScreenSpaceError: 1000,
  }
  const entity = viewer.entities.add({
    position,
    tileset: options
  });
  viewer.zoomTo(entity);
  return entity
}

export {
  add
}