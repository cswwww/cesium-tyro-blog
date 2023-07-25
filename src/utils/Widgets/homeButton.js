/*
 * @Date: 2023-07-05 18:34:16
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-25 11:35:17
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

    // ! e.cancel = true 时下段代码才生效
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(116.404269, 39.922793, 100000),
    })
  });

  viewer.homeButton.viewModel.duration = 1; // 设置相机移动动画持续时间
  console.log('viewer.homeButton.viewModel: ', viewer.homeButton.container);
  viewer.homeButton.viewModel.tooltip = '回到初始姿态';

  // 改变图标：修改按钮子元素
  viewer.homeButton.container.querySelector('button').innerHTML =
  '<svg t="1690255299600" class="cesium-svgPath-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15507" width="200" height="200"><path d="M223.444 424.016A60 60 0 0 0 202 469.986V822h170V606c0-33.138 26.862-60 60-60h160c33.138 0 60 26.862 60 60v216h170V469.986a60 60 0 0 0-21.444-45.97l-250-209.678c-22.3-18.704-54.812-18.704-77.112 0l-250 209.678zM562 636h-100v186c0 49.706-40.294 90-90 90h-170c-49.706 0-90-40.294-90-90V469.986a150 150 0 0 1 53.608-114.928l250-209.678c55.754-46.76 137.03-46.76 192.784 0l250 209.678A150 150 0 0 1 912 469.986V822c0 49.706-40.294 90-90 90h-170c-49.706 0-90-40.294-90-90v-186z" p-id="15508"></path></svg>'
}

export {
  homeButton
}