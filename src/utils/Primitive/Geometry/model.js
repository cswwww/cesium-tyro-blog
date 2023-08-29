// TODO 未完成

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

var origin = Cesium.Cartesian3.fromDegrees(-120, 44.0, 0)
// 创建一个本地的东北向上坐标系，其原点为经度-120度，纬度44.0度。
// 可以随时更改模型的modelMatrix属性以移动或旋转模型。
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)
var model = viewer.scene.primitives.add(
  Cesium.Model.fromGltf({
    url: '@/assets/model/glb/Cesium_Man.glb',
    modelMatrix: modelMatrix,
    // modelMatrix: Cesium.Matrix4.fromTranslationQuaternionRotationScale(Cesium.Cartesian3.fromDegrees(117.66, 36.1, 330), Cesium.Quaternion.fromHeadingPitchRoll(Cesium.HeadingPitchRoll.fromDegrees(0, 20, -45)), new Cesium.Cartesian3(1, 1, 1)),
    minimumPixelSize: 128,
    maximumScale: 20000
  })
)
model.readyPromise.then(function(model) {
  // Play all animations when the model is ready to render
  model.activeAnimations.addAll()
})
