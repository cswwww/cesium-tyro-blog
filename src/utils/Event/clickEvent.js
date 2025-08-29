import * as Cesium from 'cesium'
import { map as viewer } from '@/utils/createCesium.js'
/**
 * @description: 获取当前鼠标点击位置坐标，并添加到图上显示
 * @param {*} viewer
 * @return {*}
 */
function getClickPointAdd () {
  // 注册屏幕点击事件
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction(function (event) {
    // 转换为不包含地形的笛卡尔坐标
    const clickPosition = viewer.scene.camera.pickEllipsoid(event.position)
    // 转经纬度（弧度）坐标
    const radiansPos = Cesium.Cartographic.fromCartesian(clickPosition)
    // 转角度
    console.log('经度：' + Cesium.Math.toDegrees(radiansPos.longitude) + ', 纬度：' + Cesium.Math.toDegrees(radiansPos.latitude))

    // 添加点
    viewer.entities.add({
      position: clickPosition,
      point: {
        color: Cesium.Color.YELLOW,
        pixelSize: 30
      }
    })
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

/**
 * @description: Get default left click handler
 * @return {*}
 */
function getDefaultClickEvent (click = 'LEFT_CLICK') {
  const clickHandler = window.viewer.screenSpaceEventHandler.getInputAction(
    window.Cesium.ScreenSpaceEventType[click]
  )
  return clickHandler
}

/**
 * @description: 获取选中的要素对象
 * @param {*} _viewer
 * @return {*}
 */
function getClickFeature () {
  // 选中的要素对象
  let selectedFeature
  // 交互句柄
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction(function (event) {
    // 将上次选中的要素的颜色重置
    if (selectedFeature) {
      selectedFeature.color = Cesium.Color.WHITE
    }
    // 拾取要素
    selectedFeature = viewer.scene.pick(event.position)
    if (!selectedFeature) return
    const obj = {}
    // 获取要素属性信息
    selectedFeature.getPropertyIds().forEach(id => {
      console.log('打印下id', id)
      obj[id] = selectedFeature.getProperty(id)
    })
    // 设置要素颜色
    selectedFeature.color = Cesium.Color.AQUA
    setTimeout(() => {
      alert(JSON.stringify(obj))
    }, 500)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

export {
  getClickPointAdd,
  getClickFeature,
  getDefaultClickEvent
}
