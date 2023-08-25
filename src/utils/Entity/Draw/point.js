import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

/**
 * Registers a screen click event and adds a point to the viewer.
 */
function draw() {
  // 注册屏幕点击事件
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction(function(event) {
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

export {
  draw
}
