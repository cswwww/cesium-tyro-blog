/*
 * @Date: 2023-07-05 16:47:45
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-08-25 15:16:16
 * @FilePath: \cesium-tyro-blog\src\utils\Event\pickEvent.js
 * @Description: 一些获取事件
 * import { rayCoords } from '@/utils/Event/pickEvent.js'
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

const screenSpaceEventTypeMap = {
  左键单击: 'LEFT_CLICK',
  左键双击: 'LEFT_DOUBLE_CLICK',
  左键按下: 'LEFT_DOWN',
  左键松开: 'LEFT_UP',
  右键单击: 'RIGHT_CLICK',
  右键按下: 'RIGHT_DOWN',
  右键松开: 'RIGHT_UP',
  中键单击: 'MIDDLE_CLICK',
  中键按下: 'MIDDLE_DOWN',
  中键松开: 'MIDDLE_UP',
  鼠标移动: 'MOUSE_MOVE',
  触摸缩放: 'PINCH_MOVE',
  触摸缩放结束: 'PINCH_END',
  触摸缩放开始: 'PINCH_START',
  滚轮: 'WHEEL'
}

/**
 * Returns the default click event handler based on the specified click type.
 *
 * @param {string} click - The type of click event to handle (defaults to 'LEFT_CLICK').
 * @return {function} - The click event handler function.
 */
function getDefaultClickEvent(click = 'LEFT_CLICK') {
  const clickHandler = viewer.screenSpaceEventHandler.getInputAction(
    Cesium.ScreenSpaceEventType[click]
  )
  // viewer.cesiumWidget.screenSpaceEventHandler.getInputAction(
  //   Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  // );
  console.log('clickHandler: ', clickHandler)
  return clickHandler
}

/**
 * A function that enables picking an element on the screen and invokes a callback function.
 *
 * @param {function} callback - The callback function to be invoked with the selected feature.
 * @return {void} This function does not return a value.
 */
function clickToPick(callback) {
  let feature = null // 选中的要素对象

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 交互句柄
  handler.setInputAction((event) => {
    feature = viewer.scene.pick(event.position) // 拾取要素

    if (!Cesium.defined(feature)) return

    if (feature?.id && feature.id instanceof Cesium.Entity) {
      console.log('选中了Entity')
    }
    if (feature?.primitive instanceof Cesium.Primitive) {
      console.log('选中了Primitive')
    }
    if (feature?.primitive instanceof Cesium.Model) {
      console.log('选中了模型')
    }
    if (feature instanceof Cesium.Cesium3DTileFeature) {
      console.log('选中了3DTile')
    }

    callback?.(feature) // 将选中的要素暴露给回调函数
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

// 获取地形表面经纬度和高程：地标坐标
function rayCoords(eventType = 'LEFT_CLICK', callback) {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 交互句柄
  handler.setInputAction((event) => {
    const ray = viewer.camera.getPickRay(event.position || event.endPosition) // 从摄影机位置创建一条光线，穿过世界坐标中position处的像素。
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene)

    if (Cesium.defined(cartesian)) {
      console.log('cartesian: ', cartesian)
      callback?.(cartesian)
    }
  }, Cesium.ScreenSpaceEventType[eventType])
}

// 获取椭球体表面的经纬度：世界坐标（Cartesian3）
function ellipsoidCoords(eventType = 'LEFT_CLICK', callback) {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 交互句柄
  handler.setInputAction((event) => {
    // 屏幕坐标转世界坐标:将屏幕坐标（event.position）转换为椭球体上的笛卡尔坐标 Cartesian3{x: 400390.1022929887, y: -4875636.113124782, z: 4078770.7805720475}
    const cartesian = viewer.camera.pickEllipsoid(event.position || event.endPosition, viewer.scene.globe.ellipsoid)
    if (Cesium.defined(cartesian)) {
      console.log('cartesian: ', cartesian)
      callback?.(cartesian)
    }
  }, Cesium.ScreenSpaceEventType[eventType])
}

// 获取倾斜摄影或模型点击处的坐标：场景坐标
// ! 只有在开启地形深度检测，且不使用默认地形时是准确的
function modelCoords(eventType = 'LEFT_CLICK', callback) {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 交互句柄
  handler.setInputAction((event) => {
    const cartesian = viewer.scene.pickPosition(event.position || event.endPosition)
    if (Cesium.defined(cartesian)) {
      console.log('cartesian: ', cartesian)
      callback?.(cartesian)
    }
  }, Cesium.ScreenSpaceEventType[eventType])
}

// 获取点击处屏幕坐标 ：屏幕坐标（鼠标点击位置距离canvas左上角的像素值）
function screenCoords(eventType = 'LEFT_CLICK', callback) {
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction(function(movement) {
    console.log(movement.position)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

export {
  getDefaultClickEvent,
  clickToPick,
  rayCoords,
  ellipsoidCoords,
  modelCoords,
  screenCoords
}
