/*
 * @Date: 2023-06-16 15:27:53
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-16 18:53:05
 * @FilePath: \cesium-tyro-blog\src\utils\VectorData\setEntity.js
 * @Description: 修改矢量数据entities的属性、样式
 * Polygon(dataSource)
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

/**
 * Initializes the polygons of a given data source by setting various properties such as outline
 * color, fill, extruded height, etc. Also sets up a polyline with appropriate positions and 
 * color for each polygon. Finally, zooms the viewer to the data source.
 *
 * @param {object} dataSource - The data source containing the polygons to be initialized.
 */
function Polygon(dataSource) {
  const entities = dataSource.entities.values // 获取集合中实体实例的数组
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];

    if (!entity.polygon) {
      return
    }
    entity.polygon.outline = false
    entity.polygon.outlineWidth = 3 // 有些电脑outlineWidth为大于1的值时，将不起作用，参考：https://blog.csdn.net/u014556081/article/details/114305047
    entity.polygon.outlineColor = Cesium.Color.RED

    entity.polygon.fill = true
    entity.polygon.material = Cesium.Color.fromRandom({ alpha: 1.0 })
    entity.polygon.extrudedHeight = Math.floor(Math.random() * 20000 + 100) // 设置拔高100~20100的随机数，单位是米

    entity.polyline = {
      positions: entity.polygon.hierarchy._value.positions,
      width: entity.polygon.outlineWidth,
      material: Cesium.Color.YELLOW
    }
  }
  viewer.zoomTo(dataSource)
}

export {
  Polygon
}