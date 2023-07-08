/*
 * @Date: 2023-07-05 18:34:16
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-06 17:06:42
 * @FilePath: \cesium-tyro-blog\src\utils\Widgets\homeButton.js
 * @Description: A single button widget for returning to the default camera view of the current scene.
 * https://cesium.com/learn/cesiumjs/ref-doc/HomeButton.html?classFilter=home
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function homeButton() {
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(80, 26, 150.0, 35.5) // 修改默认显示范围
  Cesium.Camera.DEFAULT_VIEW_FACTOR = -0.2; // 修改默认高度

  viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
    e.cancel = false // 是否取消原事件

    // e.cancel = true 时下段代码才生效
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(116.404269, 39.922793, 100000),
    })
  });

  viewer.homeButton.viewModel.duration = 0; // 设置相机移动动画持续时间
  viewer.homeButton.viewModel.tooltip = '回到初始姿态';

  console.log('viewer.homeButton.container: ', viewer.homeButton.container);
}

export {
  homeButton
}