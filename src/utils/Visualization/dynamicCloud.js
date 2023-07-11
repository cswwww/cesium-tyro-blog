/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-11 14:37:59
 * @FilePath: \cesium-tyro-blog\src\utils\Visualization\dynamicCloud.js
 * @Description: 加载动态云层效果
 * https://www.bilibili.com/video/BV1La4y1M7Vn/?spm_id_from=333.788&vd_source=814c2ce816d31f8a2d3129e05764f50c
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'
import earth_cloud from '../../assets/images/earth_cloud.png'
function addCloud() {
  let west = -180
  let east = 180
  viewer.entities.add({
    rectangle: {
      coordinates: new Cesium.CallbackProperty(() => {
        console.log(west);
        west = west - 1
        // east = east -1
        return Cesium.Rectangle.fromDegrees(west, -90, east, 90)
      }, false),
      height: 20000,
      material: new Cesium.ImageMaterialProperty({
        image: earth_cloud,
        transparent: true
      })
    }
  })
}

export {
  addCloud
}