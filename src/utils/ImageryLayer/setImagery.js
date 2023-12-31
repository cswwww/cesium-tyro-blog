/*
 * @Date: 2023-06-04 13:48:34
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-28 16:57:00
 * @FilePath: \cesium-tyro-blog\src\utils\ImageryLayer\setImagery.js
 * @Description: 影像图层控制
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'
let tempImageryLayer

// viewer.imageryLayers.get(0) // 获取序列号为0的图层
// viewer.imageryLayers.indexOf(layer) // 图层的索引（层级，大的在上层）
// viewer.imageryLayers.lower(layer); // 向下移一层
// viewer.imageryLayers.raise(layer); // 向上移一层
// viewer.imageryLayers.lowerToBottom(layer); // 移到最下层
// viewer.imageryLayers.raiseToTop(layer); // 移到最上层
// viewer.imageryLayers.remove(layer, true); // 移除图层
// viewer.imageryLayers.removeAll(true); // 移除全部图层

function showAllImagery(boolean = true) {
  // 获取图像图层集合
  const imageryLayers = viewer.imageryLayers

  // 遍历图像图层并隐藏它们
  const numLayers = imageryLayers.length
  for (let i = 0; i < numLayers; i++) {
    const layer = imageryLayers.get(i) // 获取图像图层对象
    layer.show = boolean // 设置图像图层隐藏
  }
}

// 获取当前场景中所有的影像图层并保存到数组中
function saveImageryLayers() {
  const layers = viewer.imageryLayers

  tempImageryLayer = []
  for (let i = 0; i < layers.length; i++) {
    tempImageryLayer.push(layers.get(i))
  }

  layers.removeAll(false) // 移除所有 ImageryLayer
}

// 重新加载之前保存的影像图层
function reloadImageryLayers() {
  const layers = viewer.imageryLayers
  layers.removeAll(false) // 移除所有 ImageryLayer

  for (let i = 0; i < tempImageryLayer.length; i++) {
    layers.add(tempImageryLayer[i])
  }
}

export {
  showAllImagery,
  saveImageryLayers,
  reloadImageryLayers
}
