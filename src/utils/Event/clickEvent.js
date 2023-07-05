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
function getDefaultClickEvent (click = 'LEFT_CLICK') {
  const clickHandler = viewer.screenSpaceEventHandler.getInputAction(
    Cesium.ScreenSpaceEventType[click]
  )
  return clickHandler
}

export {
  getDefaultClickEvent
}
