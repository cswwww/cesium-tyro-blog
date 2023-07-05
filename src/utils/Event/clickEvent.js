import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

const screenSpaceEventTypeMap = {
  左键单击: 'LEFT_CLICK',
  左键双击: 'LEFT_DOUBLE_CLICK',
  左键按下: 'LEFT_DOWN',
  左键松开: 'LEFT_UP',
  右键单击: 'RIGHT_CLICK',
  右键双击: 'RIGHT_DOUBLE_CLICK',
  右键按下: 'RIGHT_DOWN',
  右键松开: 'RIGHT_UP',
  中键单击: 'MIDDLE_CLICK',
  中键按下: 'MIDDLE_DOWN',
  中键松开: 'MIDDLE_UP',
  鼠标移动: 'MOUSE_MOVE',
  触摸缩放: 'PINCH_MOVE',
  触摸缩放结束: 'PINCH_END',
  触摸缩放开始: 'PINCH_START'
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
  return clickHandler
}

/**
 * A function that enables picking an element on the screen and invokes a callback function.
 *
 * @param {function} callback - The callback function to be invoked with the selected feature.
 * @return {void} This function does not return a value.
 */
function clickToPick(callback) {
  let feature = null; // 选中的要素对象

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 交互句柄
  handler.setInputAction((event) => {

    feature = viewer.scene.pick(event.position); // 拾取要素

    if (!Cesium.defined(feature)) return

    if (feature?.id && feature.id instanceof Cesium.Entity) {
      console.log("选中了Entity");
    }
    if (feature?.primitive instanceof Cesium.Primitive) {
      console.log("选中了Primitive");
    }
    if (feature?.primitive instanceof Cesium.Model) {
      console.log("选中了模型");
    }
    if (feature instanceof Cesium.Cesium3DTileFeature) {
      console.log("选中了3DTile");
    }

    callback?.(feature); // 将选中的要素暴露给回调函数
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

export {
  getDefaultClickEvent,
  clickToPick
}
