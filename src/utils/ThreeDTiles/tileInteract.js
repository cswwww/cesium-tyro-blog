/*
 * @Date: 2023-05-24 18:36:06
 * @LastEditors: 陈尚伟  chenshangwei@geostar.com.cn
 * @LastEditTime: 2023-07-05 16:52:15
 * @FilePath: \cesium-vue\src\utils\3DTiles\tileInteract.js
 * @Description: 几何体空间裁剪分屏及卷帘
 * import { tileInteract } from '@/utils/3DTiles/tileInteract.js'
 * tileInteract(tileset, '右键单击', '隐藏')
 * https://www.bilibili.com/video/BV1YP411d7Er/?spm_id_from=333.788&vd_source=814c2ce816d31f8a2d3129e05764f50c
 */
import * as Cesium from 'cesium'
import { map as viewer } from '@/utils/createCesium.js'
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
const eventReaction = {
  隐藏: 'hide',
  标注: 'annotate',
  缩放: 'zoom',
  信息: 'properties'
}
export function tileInteract (tileset, event = '左键单击', reaction = '信息') {
  if (!viewer.scene.pickPositionSupported) {
    // 判断是否支持位置拾取
    alert('浏览器不支持位置拾取')
  }

  // viewer.scene.globe.depthTestAgainstTerrain = true // 开启地形深度检测

  // 创建文字标签集合类，方便统一管理
  const annotations = viewer.scene.primitives.add(new Cesium.LabelCollection())

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
  handler.setInputAction(function (movement) {
    const feature = viewer.scene.pick(movement.position) // 拾取要素
    if (!Cesium.defined(feature)) {
      return
    }

    const action = eventReaction[reaction]
    if (action === 'annotate') {
      annotate(movement, annotations)
    } else if (action === 'properties') {
      printProperties(feature)
    } else if (action === 'zoom') {
      zoom(feature)
    } else if (action === 'hide') {
      feature.show = false
    }
  }, Cesium.ScreenSpaceEventType[screenSpaceEventTypeMap[event]])
}

/**
 * @description: 标注（注记）
 * @param {*} movement - 鼠标（事件）信息
 * @param {*} annotations - 标签集合类
 * @return {*}
 */
function annotate (movement, annotations) {
  // 判断是否支持拾取
  if (viewer.scene.pickPositionSupported) {
    // 通过屏幕坐标拾取到世界坐标
    const cartesian = viewer.scene.pickPosition(movement.position)
    if (Cesium.defined(cartesian)) {
      // 将世界坐标转换为地理坐标（即大地坐标系下的坐标）（弧度制）
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      const height = `${cartographic.height.toFixed(2)} m`

      annotations.add({ // 标签
        position: cartesian,
        text: height,
        showBackground: true,
        font: '15px monospace',
        // 锚点：标签左下角位于鼠标点击处
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // 水平方向的锚点
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直方向的锚点
        disableDepthTestDistance: 1000 // 相机距离标签建筑1000米外则标签则可能会被遮挡、进入1000范围则 深度检测会关闭，标签就会始终显示在建筑前
      })
    }
  } else {
    console.log('浏览器不支持位置拾取')
  }
}

// 打印要素信息
function printProperties (feature) {
  console.log('Properties:')
  const propertyIds = feature.getPropertyIds()
  const length = propertyIds.length
  for (let i = 0; i < length; ++i) {
    const propertyId = propertyIds[i]
    console.log(`  ${propertyId}: ${feature.getProperty(propertyId)}`)
  }
}
// 缩放
function zoom (feature) {
  const longitude = Cesium.Math.toRadians(feature.getProperty('Longitude'))
  const latitude = Cesium.Math.toRadians(feature.getProperty('Latitude'))
  const height = feature.getProperty('Height')

  const positionCartographic = new Cesium.Cartographic(
    longitude, // 弧度制
    latitude,
    height * 0.5
  )

  // 将地理坐标转换为笛卡尔坐标：将地球表面上的点转换成 Cesium 中的三维坐标
  const position = viewer.scene.globe.ellipsoid.cartographicToCartesian(
    positionCartographic
  )

  const camera = viewer.scene.camera
  const heading = camera.heading
  const pitch = camera.pitch

  const offset = offsetFromHeadingPitchRange(
    heading,
    pitch,
    height * 2.0
  )

  const transform = Cesium.Transforms.eastNorthUpToFixedFrame(position)
  Cesium.Matrix4.multiplyByPoint(transform, offset, position)

  camera.flyTo({
    destination: position,
    orientation: {
      heading,
      pitch
    },
    easingFunction: Cesium.EasingFunction.QUADRATIC_OUT // 控制相机飞行速度
  })
}

function offsetFromHeadingPitchRange (heading, pitch, range) {
  pitch = Cesium.Math.clamp(
    pitch,
    -Cesium.Math.PI_OVER_TWO,
    Cesium.Math.PI_OVER_TWO
  )
  heading = Cesium.Math.zeroToTwoPi(heading) - Cesium.Math.PI_OVER_TWO

  const pitchQuat = Cesium.Quaternion.fromAxisAngle(
    Cesium.Cartesian3.UNIT_Y,
    -pitch
  )
  const headingQuat = Cesium.Quaternion.fromAxisAngle(
    Cesium.Cartesian3.UNIT_Z,
    -heading
  )
  const rotQuat = Cesium.Quaternion.multiply(
    headingQuat,
    pitchQuat,
    headingQuat
  )
  const rotMatrix = Cesium.Matrix3.fromQuaternion(rotQuat)

  const offset = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_X)
  Cesium.Matrix3.multiplyByVector(rotMatrix, offset, offset)
  Cesium.Cartesian3.negate(offset, offset)
  Cesium.Cartesian3.multiplyByScalar(offset, range, offset)
  return offset
}
