/*
 * @Date: 2023-07-05 16:12:01
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-05 16:50:27
 * @FilePath: \cesium-tyro-blog\src\utils\ThreeDTiles\pickTilesetFeature.js
 * @Description: 3D Tiles tileset 要素拾取
 * import {getClickFeature} from '@/utils/ThreeDTiles/pickTilesetFeature.js'
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

/**
 * Retrieves the clicked feature and exposes it to the provided callback function.
 *
 * @param {Function} callback - The callback function to be executed with the clicked feature as an argument.
 * @return {void}
 */
function getClickFeature(callback) {
  let feature = null; // 选中的要素对象

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 交互句柄
  handler.setInputAction((click) => {
    if (feature) {
      feature.color = Cesium.Color.WHITE; // 将上次选中的要素的颜色重置
    }
    feature = viewer.scene.pick(click.position); // 拾取要素， returns a Cesium3DTileFeature object.
    
    if (!Cesium.defined(feature)) return

    if (feature instanceof Cesium.Cesium3DTileFeature) {
      feature.color = Cesium.Color.YELLOW;
    }
    callback?.(feature); // 将选中的要素暴露给回调函数
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

export {
  getClickFeature
}