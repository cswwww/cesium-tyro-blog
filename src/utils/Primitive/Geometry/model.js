// TODO 未完成

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

var origin = Cesium.Cartesian3.fromDegrees(-120, 44.0, 0);
// 创建一个本地的东北向上坐标系，其原点为经度-120度，纬度44.0度。
// 可以随时更改模型的modelMatrix属性以移动或旋转模型。
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
var model = viewer.scene.primitives.add(
  Cesium.Model.fromGltf({
    url: "./data/models/DracoCompressed/CesiumMilkTruck.gltf",
    modelMatrix: modelMatrix,
    minimumPixelSize: 128,
    maximumScale: 20000,
  })
);
model.readyPromise.then(function (model) {
  // Play all animations when the model is ready to render
  model.activeAnimations.addAll();
});