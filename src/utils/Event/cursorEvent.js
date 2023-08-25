/*
 * @Date: 2023-07-30 21:16:14
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-08-02 12:16:14
 * @FilePath: \cesium-tyro-blog\src\utils\Event\cursorEvent.js
 * @Description: 鼠标指针相关事件
 * import { pickCursor } from '@/utils/Event/cursorEvent.js'
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

let handleInstance // 指针实例
const svgIcon = `<svg t="1690723682852" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13680" xmlns:xlink="http://www.w3.org/1999/xlink" width="48" height="48"><defs><style type="text/css"></style></defs><path d="M400 400m48 0l160 0q48 0 48 48l0 160q0 48-48 48l-160 0q-48 0-48-48l0-160q0-48 48-48Z" fill="#FFFFFF00" p-id="13681"></path><path d="M416 384h224a32 32 0 0 1 32 32v224a32 32 0 0 1-32 32h-224a32 32 0 0 1-32-32v-224a32 32 0 0 1 32-32z m0 32v224h224v-224h-224z" fill="#5D6D7E" p-id="13682"></path><path d="M544 512h384v32H544v384h-32V544H96v-32h416V96h32v416z" fill="#30AD98" p-id="13683"></path></svg>`
const iconUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgIcon)))

function pickCursor(boolean = true, type) {
  if (!handleInstance) {
    handleInstance = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  }
  // ! 优化方向：减少DOM操作，将获取地球容器元素的操作放在函数外部，并将其作为参数传入函数，减少函数内部对DOM的多次查询。
  const globeElement = document.getElementById('cesiumContainer') // ! 替换为你的地球场景容器元素ID
  if (!boolean) {
    handleInstance.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    globeElement.style.cursor = 'default' // 恢复指针样式为默认值
    return
  }
  handleInstance.setInputAction(({ endPosition }) => {
    // 将鼠标位置从屏幕坐标系转换为世界坐标系
    const ray = viewer.camera.getPickRay(endPosition)
    const intersection = viewer.scene.globe.pick(ray, viewer.scene)
    if (Cesium.defined(intersection)) {
      // 鼠标在地球上
      if (type) {
        globeElement.style.cursor = type || 'pointer' // 参考：https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor
      } else {
        globeElement.style.cursor = `url(${iconUrl}) 24 24,auto` // url后的两个 24 24目的是将图片的中心定位在光标的有效点(热点)
      }
    } else {
      // 鼠标不在地球上
      globeElement.style.cursor = 'default' // 恢复指针样式为默认值
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}

export {
  pickCursor
}
