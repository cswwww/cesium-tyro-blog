/*
 * @Date: 2023-07-11 14:44:33
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-19 18:45:30
 * @FilePath: \cesium-tyro-blog\src\utils\Visualization\radarScan.js
 * @Description: 雷达扫描（自定义材质加载）
 * https://www.bilibili.com/video/BV1gs4y1E7LM/?spm_id_from=333.788&vd_source=814c2ce816d31f8a2d3129e05764f50c
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'
import '@/utils/Material/RadarScanMaterialProperty.js'

/**
 * @description: 雷达扫描材质类
 * @info: 自定义的材质需严格按照cesium的材质机制来写
 * @return {*}
 */


function addRadar() {
  let rader = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061),
    name: '雷达扫描',
    ellipse: {
      semiMajorAxis: 1000.0,
      semiMinorAxis: 1000.0,
      material: new RadarScanMaterialProperty({
        color: new Cesium.Color(1.0, 1.0, 0.0, 0.2),
        speed: 20.0,
      }),
      height: 60,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      outline: true,
      outlineColor: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
    }
  })
  viewer.flyTo(rader)
}

export {
  addRadar
} 