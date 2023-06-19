/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-19 19:30:43
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\point.js
 * @Description: 实体类中点的相关函数
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function add(x = -75.59,y = 40.03883) {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(x, y),
    point: {
      show: true,
      pixelSize: 10, // 像素大小
      heightReference: Cesium.HeightReference.NONE,
      color: Cesium.Color.YELLOW,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 0,
      scaleByDistance: new Cesium.NearFarScalar(1.0e3, 10.0, 2.0e3, 1.0),
      translucencyByDistance: new Cesium.NearFarScalar(
        1.0e3,
        1.0,
        1.5e6,
        0.5
      ),
      // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      //   1.0e3,
      //   2.0e3
      // ),
      // 获取或设置与相机的距离，在深度处禁用深度测试，例如，以防止剪切地形。
      // 设置为零时，将始终应用深度测试。设置为Number.POSITIVE_INFINITY时，永远不会应用深度测试。
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
  });
}