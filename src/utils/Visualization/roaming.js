/*
 * @Date: 2023-07-28 16:21:53
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-30 22:04:35
 * @FilePath: \cesium-tyro-blog\src\utils\Visualization\roaming.js
 * @Description: 相机漫游效果
 * import {roaming} from '@/utils/Visualization/roaming.js'
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'
import { showAllImagery } from '@/utils/ImageryLayer/setImagery.js'
import darkEarth from '@/assets/images/darkEarth.jpg'
import { ElMessage } from 'element-plus'

async function roaming() {
  let isRoaming = true; // 漫游标志位
  const DEFAULT_LIGHTING = viewer.scene.globe.enableLighting; // 默认光照状态
  const DEFAULT_SKY_ATMOSPHERE = viewer.scene.skyAtmosphere.show; // 默认光照状态
  let bgImglayer;

  showAllImagery(false); // 隐藏所有图层
  viewer.clock.multiplier = -2000.0;  // 时间加速！

  const provider = await Cesium.SingleTileImageryProvider.fromUrl('/src/assets/images/darkEarth.jpg')

  bgImglayer = viewer.imageryLayers.addImageryProvider(provider); // 加载背景底图
  bgImglayer.id = '漫游背景底图'

  if (!DEFAULT_LIGHTING) {
    viewer.scene.globe.enableLighting = true; // 开启光照
  }
  if (!DEFAULT_SKY_ATMOSPHERE) {
    viewer.scene.skyAtmosphere.show = true; // 开启天空大气，能在一定程度上降低地球轮廓锯齿
  }

  // 添加鼠标事件，触发后停止漫游效果
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 交互句柄
  handler.setInputAction((event) => {
    isRoaming = false // 停止旋转
    showAllImagery(true) // 显示图层
    if (!DEFAULT_LIGHTING) {
      viewer.scene.globe.enableLighting = false; // 关闭光照
    }
    if (!DEFAULT_SKY_ATMOSPHERE) {
      viewer.scene.skyAtmosphere.show = false; // 关闭光照
    }
    viewer.imageryLayers.remove(bgImglayer, true); // 移除图层
    viewer.clock.multiplier = 1;  // 正常时间流速
    enterMessage.close()
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK); // 移除鼠标事件监听
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  (function roamingEvent() {
    if (isRoaming) {
      // 控制相机围绕 Z 轴旋转
      viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, Cesium.Math.toRadians(0.1));
      requestAnimationFrame(roamingEvent);
    }
  })()
  const enterMessage = ElMessage({
    duration: 0,
    icon: 'Sunny',
    message: 'Greetings! 点击地球结束漫游动画，让我们正式进入应用场景！',
  })
}


export {
  roaming
}