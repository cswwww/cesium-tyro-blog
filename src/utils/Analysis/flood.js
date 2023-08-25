/*
 * @Date: 2023-07-11 15:47:29
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-11 16:20:43
 * @FilePath: \cesium-tyro-blog\src\utils\Analysis\flood.js
 * @Description: 淹没分析效果（水面上升）
 * import {flood} from '@/utils/Analysis/flood.js'
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function flood() {
  if (!viewer.scene.globe.depthTestAgainstTerrain) {
    viewer.scene.globe.depthTestAgainstTerrain = true // 该功能需开启地形深度检测
  }
  if (viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider) { // 如果没加载地形就加一个
    viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
      url: Cesium.IonResource.fromAssetId(3956),
      requestWaterMask: true, // 请求水体效果所需要的海岸线数据
      requestVertexNormals: true // 请求地形照明数据:增加法线提高光照效果
    })
  }

  let waterMinElevation = 180 // 淹没水平面最低值
  const waterMaxElevation = 400 // 淹没水平面最高值
  const positions = Cesium.Cartesian3.fromDegreesArrayHeights([116.64, 36.34, 8000, 116.66, 36.34, 8000, 116.66, 36.32, 8000, 116.64, 36.32, 8000, 116.64, 36.34, 8000])

  const entity = viewer.entities.add({
    polygon: {
      hierarchy: new Cesium.PolygonHierarchy(positions),
      extrudedHeight: new Cesium.CallbackProperty(() => {
        if (waterMinElevation < waterMaxElevation) {
          waterMinElevation += 0.1
        }
        return waterMinElevation
      }, false),
      material: Cesium.Color.fromCssColorString('#3D81A5').withAlpha(0.7)
    }
  })

  viewer.entities.add({
    polygon: {
      hierarchy: new Cesium.PolygonHierarchy(positions),
      material: Cesium.Color.WHITE.withAlpha(0.3)
    },
    polyline: {
      positions: positions,
      width: 4,
      clampToGround: true
    }
  })

  viewer.flyTo(entity)
}

export {
  flood
}
