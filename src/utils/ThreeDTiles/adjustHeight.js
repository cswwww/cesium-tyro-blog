/*
 * @Date: 2023-05-23 11:54:36
 * @LastEditors: chenshangwei  cswwww@163.com
 * @LastEditTime: 2023-05-23 11:58:38
 * @FilePath: \cesium-vue\src\utils\3DTiles\adjustHeight.js
 * @Description: 调整模型高度
 * import { adjustTilesetHeight } from '@/utils/3DTiles/adjustHeight.js'
 * e.g.: adjustTilesetHeight(tileset, 20)
 */
import * as Cesium from 'cesium'

/**
 * @param {Object} tileset - 模型集合
 * @param {Number} height - 高度(m)
 * @return {*}
 */
export function adjustTilesetHeight (tileset, height = 10) {
  // 计算出模型包围球的中心点(弧度制)，从世界坐标转弧度制
  const cartographic = Cesium.Cartographic.fromCartesian(
    tileset.boundingSphere.center
  )
  // 计算与模型包围球中心点经纬度相同的地表点位
  const surface = Cesium.Cartesian3.fromRadians(
    cartographic.longitude,
    cartographic.latitude,
    0.0
  )
  // 计算调整高度后的模型包围球的中心点
  const offset = Cesium.Cartesian3.fromRadians(
    cartographic.longitude,
    cartographic.latitude,
    height
  )
  // 计算差向量
  const translation = Cesium.Cartesian3.subtract(
    offset,
    surface,
    new Cesium.Cartesian3()
  )
  // 修改模型的变换矩阵，通过四维矩阵
  tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
}
