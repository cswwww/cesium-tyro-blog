/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-27 11:10:55
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\Graphics\wall.js
 * @Description: 实体类中墙的相关函数
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

// viewer.entities.add({
//   name: "立体墙",
//   wall: {
//     positions: Cesium.Cartesian3.fromDegreesArray([117.154815, 31.853495, 117.181255, 31.854257, 117.182284, 31.848255, 117.184748, 31.840141, 117.180557, 31.835556, 117.180023, 31.833741, 117.166846, 31.833737, 117.155531, 31.833151, 117.154787, 31.835978, 117.151994, 31.839036, 117.150691, 31.8416, 117.151215, 31.844734, 117.154457, 31.848152, 117.154815, 31.853495]),
//     maximumHeights: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600],
//     minimumHeights: [43.9, 49.4, 38.7, 40, 54, 51, 66.7, 44.6, 41.2, 31.2, 50.1, 53.8, 46.9, 43.9],
//     material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.ORANGE, 3000)
//   }
// })

function add() {
  const options = {
    show: true,

    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
      -115.0,
      44.0,
      200000.0,
      -90.0,
      44.0,
      200000.0
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

    shadows: Cesium.ShadowMode.DISABLED
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
  }
  const entity = viewer.entities.add({
    wall: options
  })
  viewer.zoomTo(entity)
  return entity
}

export {
  add
}
