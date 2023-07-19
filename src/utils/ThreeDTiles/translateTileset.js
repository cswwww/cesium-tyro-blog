/*
 * @Date: 2023-06-28 19:35:03
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-19 11:58:33
 * @FilePath: \cesium-tyro-blog\src\utils\ThreeDTiles\translateTileset.js
 * @Description: 平移（Translation）：将Tileset在三维场景中沿着指定的方向平移
 * 
 * import {setPosition} from '@/utils/ThreeDTiles/translateTileset.js'
 * setPosition(tileset, 113.27, 23.13, 10)
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

/**
 * Sets the position of the tileset to the specified coordinates.
 *
 * @param {Object} tileset - The tileset to set the position for.
 * @param {Number} lng - The longitude of the new position in degrees. Defaults to the current tileset's longitude.
 * @param {Number} lat - The latitude of the new position in degrees. Defaults to the current tileset's latitude.
 * @param {Number} h - The height of the new position in meters. Defaults to the current tileset's height.
 * @return {undefined} This function does not return a value.
 */
function setPosition(tileset, lng, lat, h) {
  // 计算出模型包围球的中心点(弧度制)，从世界坐标转弧度制
  const cartographic = Cesium.Cartographic.fromCartesian(
    tileset.boundingSphere.center
  )
  const { longitude, latitude, height } = cartographic
  console.log('h: ', h);
  console.log('height: ', height);

  // 模型包围球的中心点坐标，输出以笛卡尔坐标系表示的三维坐标点
  const surface = Cesium.Cartesian3.fromRadians(
    longitude,
    latitude,
    height
  )

  // 新的位置的中心点坐标，输出以笛卡尔坐标系表示的三维坐标点
  const offset = Cesium.Cartesian3.fromDegrees(
    lng || Cesium.Math.toDegrees(longitude),
    lat || Cesium.Math.toDegrees(latitude),
    height + h || height
  );

  // 计算差向量：计算tileset的平移量，并将其应用到modelMatrix中
  const translation = Cesium.Cartesian3.subtract(
    offset,
    surface,
    new Cesium.Cartesian3()
  )

  // 修改模型的变换矩阵，通过四维矩阵
  tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
  // viewer.zoomTo(tileset);
}

/**
 * Resets the position of a tileset to a specified model matrix or the identity matrix if none is provided.
 *
 * @param {Tileset} tileset - The tileset to reset the position of.
 * @param {Matrix4} modelMatrix - Optional. The model matrix to set the tileset's position to. If not provided, the identity matrix（单位向量） will be used.
 */
function serMatrix(tileset, matrix) {
  tileset.modelMatrix = matrix || Cesium.Matrix4.IDENTITY
  viewer.zoomTo(tileset);
}

function setScale(tileset) {
  // 计算出模型包围球的中心点(弧度制)，从世界坐标转弧度制
  const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
  const { longitude, latitude, height } = cartographic


  const surface = Cesium.Cartesian3.fromRadians(
    longitude,
    latitude,
    height
  )

  const m = Cesium.Transforms.eastNorthUpToFixedFrame(surface);
  const scale = Cesium.Matrix4.fromUniformScale(3); // 缩放比例，大于1放大，小于1缩小

  Cesium.Matrix4.multiply(m, scale, m)
  tileset._root.transform = m;

  viewer.zoomTo(tileset);
}

export {
  setPosition,
  serMatrix,
  setScale
}