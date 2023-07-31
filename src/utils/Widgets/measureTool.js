/*
 * @Date: 2023-07-31 12:28:08
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-31 18:49:58
 * @FilePath: \cesium-tyro-blog\src\utils\Widgets\measureTool.js
 * @Description: 测量工具
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'


// 坐标拾取
// import { coordinatePicker } from '@/utils/Widgets/measureTool.js'
function coordinatePicker(eventType = 'LEFT_CLICK', callback) {
const measureHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 测量工具的交互句柄单例
  measureHandler.setInputAction((event) => {
    const ray = viewer.camera.getPickRay(event.position || event.endPosition); // 从摄影机位置创建一条光线，穿过世界坐标中position处的像素。
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene);

    if (Cesium.defined(cartesian)) {
      console.log('cartesian: ', cartesian);
      callback?.(cartesian);
    }
  }, Cesium.ScreenSpaceEventType[eventType]);
}

export {
  coordinatePicker
}